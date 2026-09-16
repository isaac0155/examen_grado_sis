export function shuffle(items, random = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function grade(question, answer) {
  if (!answer || answer.kind === 'draft') return 'pending';
  if (!question.scorable) return 'excluded';
  if (answer.kind === 'unknown') return 'unknown';
  if (question.type === 'open') return answer.kind === 'self' ? (answer.correct ? 'correct' : 'wrong') : 'pending';
  return question.correctOptions.includes(answer.value) ? 'correct' : 'wrong';
}

export function summarize(questions, answers) {
  const result = { correct:0, wrong:0, unknown:0, pending:0, excluded:0, total:questions.length, automaticCorrect:0, automaticTotal:0, selfCorrect:0, selfTotal:0 };
  for (const q of questions) {
    const status = grade(q, answers[q.id]);
    result[status]++;
    if (q.scorable) {
      const type = q.type === 'open' ? 'self' : 'automatic';
      result[type + 'Total']++;
      if (status === 'correct') result[type + 'Correct']++;
    }
  }
  result.denominator = questions.filter(q => q.scorable).length;
  result.percent = result.denominator ? Math.round(100 * result.correct / result.denominator) : null;
  return result;
}

export function needsReview(q, answer) {
  return Boolean(answer) && (!q.scorable || ['wrong','unknown'].includes(grade(q,answer)));
}

export function promptText(q) {
  return q.prompt.map(b => b.type === 'table' ? b.rows.map(row => row.join(' | ')).join('\n') : b.text).join('\n\n');
}

export function exportQuestions(questions, answers = {}) {
  const intro = 'Estoy preparando mi examen de grado de Ingeniería de Sistemas. Ayúdame a entender estas preguntas: explica el razonamiento, por qué las otras opciones no corresponden y dame un ejemplo. Después evalúame una por una sin mostrarme inicialmente la respuesta. La clave fue revisada por IA y puede contener matices; respeta las advertencias y verifica los casos dudosos.\n';
  return intro + questions.map(q => {
    const a = answers[q.id];
    const selected = a?.kind === 'unknown' ? 'No sé la respuesta' : a?.kind === 'choice' ? a.value : a?.text || 'Sin respuesta';
    const correct = !q.scorable ? 'SIN OPCIÓN VÁLIDA CONFIRMADA. No se califica. El Word marca ' + q.sourceCorrectOptions.join(', ') : q.type === 'open' ? 'Respuesta guía (autoevaluación):\n' + q.modelAnswer : 'Respuesta(s) correcta(s): ' + q.correctOptions.join(', ');
    return `\nPregunta ${q.id} · ${q.topic}\n${promptText(q)}\n\n${q.options.map(o => `${o.id}) ${o.text}${q.correctOptions.includes(o.id) ? ' [CORRECTA]' : ''}`).join('\n')}\n${correct}\nMi respuesta: ${selected}\n${q.explanation ? 'Explicación: ' + q.explanation + '\n' : ''}${q.reviewNote ? 'Aclaración: ' + q.reviewNote + '\n' : ''}${q.sources.length ? 'Fuentes: ' + q.sources.join(' · ') + '\n' : ''}`;
  }).join('\n------------------------------\n');
}

export function validSession(s, bank) {
  if (!s || s.version !== bank.version || !Array.isArray(s.order) || !s.order.length || typeof s.answers !== 'object' || s.answers === null) return false;
  if (!Number.isInteger(s.index) || s.index < 0 || s.index >= s.order.length || typeof s.finished !== 'boolean') return false;
  if (new Set(s.order).size !== s.order.length) return false;
  const ids = new Map(bank.questions.map(q => [q.id,q]));
  if (!s.order.every(id => ids.has(id))) return false;
  return Object.entries(s.answers).every(([id,a]) => {
    const q = ids.get(Number(id));
    if (!q || !s.order.includes(q.id) || !a) return false;
    return a.kind === 'unknown' || (a.kind === 'choice' && q.type !== 'open' && q.options.some(o => o.id === a.value)) || (q.type === 'open' && ['draft','self'].includes(a.kind) && typeof a.text === 'string' && (a.kind === 'draft' || typeof a.correct === 'boolean'));
  }) && (!s.finished || s.order.every(id => grade(ids.get(id),s.answers[id]) !== 'pending'));
}
