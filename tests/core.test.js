import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shuffle, grade, summarize, needsReview, exportQuestions, validSession } from '../core.js';
const bank = JSON.parse(readFileSync(new URL('../data/questions.json',import.meta.url),'utf8'));
const q = id => bank.questions.find(q=>q.id===id);

test('Banco completo: numeración, tipos, tablas y respuestas válidas',()=>{
  assert.deepEqual(bank.questions.map(q=>q.id),Array.from({length:147},(_,i)=>i+1));
  assert.equal(bank.questions.filter(q=>q.type==='open').length,12);
  assert.equal(bank.questions.filter(q=>q.type==='boolean').length,4);
  assert.equal(bank.questions.flatMap(q=>q.prompt).filter(b=>b.type==='table').length,13);
  for(const question of bank.questions){
    assert.ok(question.sourceAnswer);
    assert.ok(question.prompt.length);
    assert.ok(question.type==='open'?question.modelAnswer:question.explanation);
    if(question.type!=='open'){
      assert.equal(question.options.length,question.type==='boolean'?2:4);
      assert.equal(new Set(question.options.map(o=>o.id)).size,question.options.length);
      assert.ok(!question.scorable || question.correctOptions.length>0);
      question.correctOptions.forEach(id=>assert.ok(question.options.some(o=>o.id===id)));
    }
  }
});
test('Mezcla sin perder, duplicar ni modificar preguntas',()=>{
  const ids=bank.questions.map(q=>q.id), original=[...ids];
  const shuffled=shuffle(ids,()=>0.3);
  assert.deepEqual(ids,original);
  assert.deepEqual([...shuffled].sort((a,b)=>a-b),original);
  assert.notDeepEqual(shuffled,original);
});
test('Puntaje: abiertas, desconocidas, exclusiones y opciones equivalentes',()=>{
  const qs=[q(1),q(2),q(28),q(29),q(55),q(118)];
  const answers={1:{kind:'choice',value:'B'},2:{kind:'choice',value:'A'},28:{kind:'self',correct:true,text:'prueba'},29:{kind:'unknown'},55:{kind:'choice',value:'D'},118:{kind:'choice',value:'C'}};
  const s=summarize(qs,answers);
  assert.equal(s.percent,60);assert.equal(s.denominator,5);
  assert.equal(s.correct,3);assert.equal(s.wrong,1);assert.equal(s.unknown,1);assert.equal(s.excluded,1);
  assert.equal(s.automaticCorrect,2);assert.equal(s.automaticTotal,3);
  assert.equal(s.selfCorrect,1);assert.equal(s.selfTotal,2);
  assert.deepEqual(qs.filter(q=>needsReview(q,answers[q.id])).map(q=>q.id),[2,29]);
  assert.equal(grade(q(118),{kind:'choice',value:'B'}),'correct');
  assert.equal(summarize([q(55)],{55:{kind:'unknown'}}).percent,null);
});
test('Borradores abiertos no son aciertos ni permiten finalizar',()=>{
  assert.equal(grade(q(28),{kind:'draft',text:'hola',revealed:true}),'pending');
  const s={version:bank.version,order:[28],index:0,finished:true,answers:{28:{kind:'draft',text:'hola'}}};
  assert.equal(validSession(s,bank),false);
  s.finished=false;assert.equal(validSession(s,bank),true);
});
test('Rechaza sesiones incompatibles o corruptas y restaura respuestas válidas',()=>{
  const s={version:bank.version,order:[1,118],index:1,finished:true,answers:{1:{kind:'choice',value:'B'},118:{kind:'choice',value:'C'}}};
  assert.ok(validSession(s,bank));
  for(const patch of [{version:'old'},{order:[1,1]},{order:[999]},{index:99},{answers:{1:{kind:'choice',value:'X'}}},{answers:null}]) assert.equal(validSession({...s,...patch},bank),false);
});
test('Exporta preguntas, tablas, opciones correctas, guías y observaciones',()=>{
  const text=exportQuestions([q(31),q(118),q(55),q(63)],{31:{kind:'unknown'}});
  assert.ok(text.includes('vuelo_id'));
  assert.ok(text.includes('101 | VL-500 | 12A'));
  assert.ok(text.includes('B) LIFO [CORRECTA]'));
  assert.ok(text.includes('C) FILO [CORRECTA]'));
  assert.ok(text.includes('SIN OPCIÓN VÁLIDA CONFIRMADA'));
  assert.ok(text.includes('DECLARE EXIT HANDLER'));
  assert.ok(text.includes('Mi respuesta: No sé la respuesta'));
});
test('Correcciones conservan el origen y corrigen la CTE',()=>{
  assert.ok(q(50).sourcePrompt.some(b=>b.text?.includes(' ROM ')));
  assert.ok(q(50).prompt.some(b=>b.text?.includes('cadena AS (')));
  assert.ok(!q(50).prompt.some(b=>b.text?.includes('\n ROM')));
  assert.deepEqual(q(55).sourceCorrectOptions,['D']);
  assert.deepEqual(q(55).correctOptions,[]);
  assert.deepEqual(q(118).sourceCorrectOptions,['B']);
});
