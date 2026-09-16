"""Importa el banco original sin ejecutar sus contenidos. Solo biblioteca estándar.
Uso: python scripts/import_docx.py ruta/al/banco.docx
Las revisiones editoriales se mantienen por separado en data/revisions.json.
"""
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

def paragraph(el):
    return ''.join(n.text or '' if n.tag == W+'t' else '\n' if n.tag == W+'br' else '\t' if n.tag == W+'tab' else '' for n in el.iter()).strip()

def extract(path):
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read('word/document.xml'))
    blocks = []
    for el in root.find(W+'body'):
        if el.tag == W+'p':
            # La pregunta 43 está pegada a la explicación de la 42 en el Word.
            for part in re.split(r'(?=43\. Escenario:)', paragraph(el)):
                if part.strip():
                    blocks.append({'type':'text', 'text':part.strip()})
        elif el.tag == W+'tbl':
            rows = [[ '\n'.join(paragraph(p) for p in cell.findall('.//'+W+'p')) for cell in row.findall(W+'tc')] for row in el.findall(W+'tr')]
            blocks.append({'type':'table', 'rows':rows})
    return blocks

def topic(n):
    return 'Ingeniería de software' if n <= 30 else 'Bases de datos' if n <= 82 else 'Inteligencia artificial' if n <= 97 else 'Programación y estructuras' if n <= 127 else 'Desarrollo web'

def parse(blocks):
    questions = []
    current = None
    state = 'prompt'
    for block in blocks:
        s = block.get('text','')
        match = re.match(r'^(\d+)[.:]\s+(.+)', s, re.S)
        if match:
            current = {'id':int(match[1]), 'topic':topic(int(match[1])), 'prompt':[{'type':'text','text':match[2]}], 'options':[], 'sourceAnswer':'', 'correctOptions':[], 'scorable':True}
            questions.append(current)
            state = 'prompt'
        elif current:
            if s.startswith('Tema '):
                continue
            answer = re.match(r'^[✓\s]*Respuesta(?: correcta| esperada)?\s*:\s*(.*)', s, re.I|re.S)
            option = re.match(r'^([A-Da-d])\)\s*(.+)',s,re.S)
            if answer:
                current['sourceAnswer'] = answer[1]
                state = 'answer'
            elif option and state != 'answer':
                current['options'].append({'id':option[1].upper(), 'text':option[2]})
                state = 'option'
            elif state == 'answer':
                current['sourceAnswer'] += '\n'+s
            elif state == 'option' and s:
                current['options'][-1]['text'] += '\n'+s
            else:
                current['prompt'].append(block)
    for q in questions:
        ans = q['sourceAnswer'].strip()
        q['sourceAnswer'] = ans
        if q['options']:
            m = re.match(r'^([A-Da-d])(?:[.)\s]|$)', ans)
            assert m, (q['id'], ans)
            q['correctOptions'] = [m[1].upper()]
            q['type'] = 'choice'
            q['explanation'] = re.sub(r'^[A-Da-d][.)]?\s*','',ans)
        elif re.match(r'^(Verdadero|Falso)\.', ans):
            q['type'] = 'boolean'
            q['options'] = [{'id':'V','text':'Verdadero'}, {'id':'F','text':'Falso'}]
            q['correctOptions'] = ['V' if ans.startswith('Verdadero') else 'F']
            q['explanation'] = ans
        else:
            q['type'] = 'open'
            q['modelAnswer'] = ans
            q['explanation'] = ''
        q['sourceCorrectOptions'] = q['correctOptions'].copy()
        q['reviewNote'] = ''
        q['sources'] = []
    assert [q['id'] for q in questions] == list(range(1,148)), 'Numeración incompleta'
    return questions

def main():
    path = Path(sys.argv[1])
    questions = parse(extract(path))
    revisions = json.loads((ROOT/'data/revisions.json').read_text(encoding='utf-8'))
    for q in questions:
        revision = revisions.get(str(q['id']),{})
        if 'prompt' in revision:
            q['sourcePrompt'] = q['prompt']
        if 'options' in revision:
            q['sourceOptions'] = q['options']
        q.update(revision)
        assert q['type'] == 'open' or len(q['options']) in (2,4)
        assert all(a in [o['id'] for o in q['options']] for a in q['correctOptions'])
    bank = {'schemaVersion':1,'version':'2026-09-16.1','title':'Banco de examen de grado · Ingeniería de Sistemas','sourceFile':path.name,'sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'review':{'date':'2026-09-16','passes':['Resolución conceptual de las 147 preguntas y comparación con la clave del documento.','Revisión de distractores, ambigüedades, SQL y contraste documental de los casos dudosos.','Revisión final por pregunta de clave, explicación y criterio de calificación.'],'notice':'Clave de estudio revisada por IA, no clave oficial validada por el docente. Las abiertas se autoevalúan; la pregunta 55 no puntúa.'},'questions':questions}
    (ROOT/'data/questions.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'questions':len(questions),'types':{t:sum(q['type']==t for q in questions) for t in ('choice','boolean','open')},'tables':sum(b['type']=='table' for q in questions for b in q['prompt'])},ensure_ascii=False))

if __name__ == '__main__':
    main()
