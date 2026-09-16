import { shuffle, grade, summarize, needsReview, exportQuestions, validSession } from './core.js';

const $ = (s) => document.querySelector(s);
const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'grado.session.v1';
let bank, questions, session = null, storageOK = true;
let exportText = '', resultFilter = 'review';
const main = $('#main');
const typeNames = { choice:'Opción múltiple', boolean:'Verdadero o falso', open:'Respuesta abierta' };
const topics = ['Ingeniería de software','Bases de datos','Inteligencia artificial','Programación y estructuras','Desarrollo web'];
const icons = ['◈','▤','✳','⌘','⌗'];

function toast(text) {
  $('#toast').textContent = text;
  $('#toast').classList.add('visible');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $('#toast').classList.remove('visible'), 4500);
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(session)); }
  catch { storageOK = false; toast('No se pudo guardar. Puedes seguir practicando, pero evita cerrar esta pestaña.'); }
}
function getQuestions() { return session.order.map(id => questions.get(id)); }
function completedCount() { return getQuestions().filter(q => grade(q,session.answers[q.id]) !== 'pending').length; }
function navigate(hash) {
  if (location.hash === '#' + hash) render(); else location.hash = hash;
}
function focusMain() { main.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
function pill(text, cls = '') { return `<span class="pill ${cls}">${escape(text)}</span>`; }
function blocks(q) {
  return q.prompt.map(b => b.type === 'table'
    ? `<div class="table-scroll" role="region" aria-label="Datos de la pregunta ${q.id}" tabindex="0"><table><tbody>${b.rows.map((r,i) => `<tr>${r.map(c => `<${i===0?'th scope="col"':'td'}>${escape(c)}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table></div>`
    : `<p class="question-text">${escape(b.text)}</p>`).join('');
}
function notes(q) {
  return `${q.reviewNote ? `<div class="review-note"><strong>Aclaración de la revisión</strong><p>${escape(q.reviewNote)}</p></div>` : ''}${q.sources.length ? `<p class="sources">Consultar: ${q.sources.map((url,i) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">Fuente ${i+1} ↗</a>`).join(' · ')}</p>` : ''}`;
}
function solution(q) {
  return `${!q.scorable ? `<div class="review-note"><strong>Sin calificación · consulta al docente</strong><p>El Word marca ${q.sourceCorrectOptions.join(', ')}. Ninguna opción es rigurosamente válida con la premisa actual.</p></div>` : ''}
    ${q.type === 'open' ? `<h3>Respuesta guía</h3><pre class="answer-guide">${escape(q.modelAnswer)}</pre>` : `<ul class="solution-options">${q.options.map(o => `<li class="${q.correctOptions.includes(o.id)?'correct-option':''}"><b>${o.id}</b><span>${escape(o.text)}</span>${q.correctOptions.includes(o.id)?'<span class="correct-label">✓ Correcta</span>':''}</li>`).join('')}</ul>`}
    ${q.explanation ? `<p class="explanation">${escape(q.explanation)}</p>` : ''}${notes(q)}`;
}

function start(ids, label) {
  if (session && !session.finished && !confirm('Tienes una práctica en curso. ¿Quieres reemplazarla con una nueva?')) return;
  session = {version:bank.version, order:shuffle(ids), answers:{}, index:0, finished:false, label, startedAt:new Date().toISOString()};
  save(); navigate('practica');
}

function home() {
  const summary = session?.finished ? summarize(getQuestions(),session.answers) : null;
  const missed = session?.finished ? getQuestions().filter(q => needsReview(q,session.answers[q.id])) : [];
  main.innerHTML = `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="little-line"></span> TU EXAMEN EMPIEZA AQUÍ</div><h1>Aprende a tu ritmo.<br><em>Llega con confianza.</em></h1><p>Transforma tu banco de preguntas en una práctica diaria. Responde, descubre qué necesitas reforzar y vuelve a intentarlo.</p><div class="hero-facts"><span>147 preguntas</span><span>5 áreas de estudio</span><span>Sin límite de tiempo</span></div></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="art-plus">+</span><div class="art-card back-card"><span>EL SIGUIENTE PASO</span><b>Ya sabes más<br>que ayer.</b><i>↗</i></div><div class="art-card front-card"><span>APRENDER, PASO A PASO</span><div class="art-bars"><i></i><i></i><i></i><i></i><i></i></div><div class="art-card-bottom"><span>Tu preparación</span><b>en marcha ↗</b></div></div><span class="art-spark">✳</span></div></section>
    <section class="dashboard-grid"><div class="practice-panel"><div class="section-kicker">01 / A PRACTICAR</div><h2>Tu próxima sesión</h2><p class="muted">Elige un área o recorre el banco completo.</p><form id="start-form"><div class="form-row"><label>Área de estudio<select id="topic-select"><option value="all">Todas las áreas</option>${topics.map(t => `<option>${t}</option>`).join('')}</select></label><label>Preguntas<select id="count-select"><option value="all">Todo el banco</option><option value="10">10 preguntas</option><option value="25">25 preguntas</option><option value="50">50 preguntas</option></select></label></div><div class="session-detail"><span class="shuffle-symbol">⇄</span><span>Preguntas en orden aleatorio<br><small>Puedes elegir «No sé la respuesta» en todas.</small></span></div><button class="primary wide" type="submit">Empezar práctica <span>↗</span></button></form><p class="fine">Las respuestas se muestran al terminar. Las 12 preguntas abiertas se comparan con una guía y se autoevalúan.</p></div>
    <aside class="progress-panel"><div class="section-kicker">02 / TU RECORRIDO</div>${session ? `<h2>${session.finished?'Una sesión, más claridad.':'Continúa donde lo dejaste.'}</h2><div class="big-stat">${session.finished ? (summary.percent ?? '—')+'<small>%</small>' : completedCount()+'<small>/ '+session.order.length+'</small>'}</div><p class="muted">${session.finished?'Puntaje de tu última práctica':'preguntas respondidas · progreso guardado'}</p><button id="resume" class="secondary wide">${session.finished?'Ver mis resultados':'Retomar práctica'} <span>→</span></button>${missed.length ? `<button id="retry-home" class="text-button">Repasar mis ${missed.length} pendientes ↗</button>`:''}` : `<h2>La constancia<br>hace la diferencia.</h2><div class="empty-progress"><span>○</span><p>Tu primera práctica<br>es el punto de partida.</p></div><p class="muted">Aquí encontrarás tu avance y las preguntas que necesitan un segundo intento.</p>`}<div class="local-note"><span class="status-dot"></span>${storageOK?'Guardado en este dispositivo':'Guardado no disponible en este navegador'}</div></aside></section>
    <section class="areas"><div class="section-heading"><h2>Todo lo que vas a dominar</h2><a href="#banco">Explorar las preguntas ↗</a></div><div class="topic-grid">${topics.map((t,i) => `<button class="topic-card" data-topic="${i}"><span class="topic-icon">${icons[i]}</span><span class="topic-name">${t}</span><span class="topic-count">${bank.questions.filter(q=>q.topic===t).length} preguntas <b>↗</b></span></button>`).join('')}</div></section>
    <div class="method-note"><span>ⓘ</span><p>Un banco revisado, con contexto. Encontrarás aclaraciones donde el Word tiene errores o ambigüedades. La pregunta 55 se conserva para estudiar y no puntúa. <a href="#revision">Ver el criterio de revisión →</a></p></div>`;
  $('#start-form').onsubmit = e => {
    e.preventDefault();
    const t = $('#topic-select').value;
    let pool = bank.questions.filter(q => t==='all' || q.topic===t);
    const count = $('#count-select').value;
    if (count !== 'all') pool = shuffle(pool).slice(0,Number(count));
    start(pool.map(q=>q.id), t==='all'?'Todas las áreas':t);
  };
  $('#resume')?.addEventListener('click',()=>navigate(session.finished?'resultados':'practica'));
  $('#retry-home')?.addEventListener('click',()=>start(missed.map(q=>q.id),'Repaso de pendientes'));
  document.querySelectorAll('[data-topic]').forEach(el=>el.onclick=()=>{ $('#topic-select').value=topics[Number(el.dataset.topic)]; $('#start-form').scrollIntoView({behavior:'smooth',block:'center'}); $('#topic-select').focus({preventScroll:true}); });
}

function practice() {
  if (!session) return home();
  if (session.finished) return results();
  const q = questions.get(session.order[session.index]);
  const a = session.answers[q.id];
  const done = completedCount();
  const revealed = q.type==='open' && (a?.revealed || a?.kind==='self');
  main.innerHTML = `<div class="practice-top"><a href="#inicio" class="back-link">← Guardar y salir</a><span>${escape(session.label)}</span><span class="saved"><span class="status-dot"></span>${storageOK?'Guardado automático':'Guardado no disponible'}</span></div>
    <div class="quiz-layout"><section class="question-panel" aria-labelledby="question-title"><div class="question-topline"><span class="eyebrow">PREGUNTA ${session.index+1} <span class="muted">DE ${session.order.length}</span></span>${pill(q.topic)}</div><progress value="${done}" max="${session.order.length}" aria-label="Preguntas respondidas">${done}</progress><div class="question-meta">${typeNames[q.type]} <span>·</span> N.º ${q.id} del banco ${!q.scorable?' · Sin calificación':''}</div><h1 id="question-title" class="sr-only">Pregunta ${session.index+1}</h1><div class="question-body">${blocks(q)}</div>
    ${!q.scorable ? '<p class="inline-warning">Esta pregunta tiene una premisa discutible. Tu elección no afectará el puntaje; al final verás la aclaración.</p>':''}
    ${q.type === 'open' ? `<label class="open-label" for="open-answer">Tu respuesta</label><textarea id="open-answer" placeholder="Escribe lo que recuerdas. No necesitas usar las mismas palabras que la guía." ${revealed?'readonly':''}>${escape(a?.text||'')}</textarea>${revealed ? `<div class="open-comparison">${solution(q)}<h3>Compara las ideas, no las palabras.</h3><p class="muted">Esto es una autoevaluación. Marca correcta solo si tu respuesta cubre lo esencial.</p><div class="actions"><button id="self-correct" class="primary">La respondí bien</button><button id="self-wrong" class="secondary">Necesito repasarla</button></div></div>` : '<button id="reveal" class="secondary">Comparar con la respuesta guía</button>'}`
      : `<fieldset class="options"><legend class="sr-only">Selecciona tu respuesta</legend>${q.options.map(o => `<label class="option ${a?.kind==='choice'&&a.value===o.id?'selected':''}"><input type="radio" name="answer" value="${o.id}" ${a?.kind==='choice'&&a.value===o.id?'checked':''}><span class="option-letter">${o.id}</span><span class="option-text">${escape(o.text)}</span><span class="radio-circle"></span></label>`).join('')}</fieldset>`}
    <button id="unknown" class="unknown ${a?.kind==='unknown'?'selected':''}"><span>?</span> No sé la respuesta <small>La guardaré para repasar</small></button>
    <div class="quiz-bottom"><button id="prev" class="ghost" ${session.index===0?'disabled':''}>← Anterior</button><span>${q.type==='open'?'Respuesta abierta · autoevaluación':'Puedes cambiar tu elección antes de terminar.'}</span><button id="next" class="primary" ${grade(q,a)==='pending'?'disabled':''}>${session.index===session.order.length-1?'Ver resultados':'Siguiente'} →</button></div></section>
    <aside class="quiz-aside"><div class="section-kicker">TU SESIÓN</div><h2>Cada pregunta cuenta.</h2><p><b>${done}</b> de ${session.order.length} respondidas</p><div class="question-map" aria-label="Ir a una pregunta">${session.order.map((id,i)=>`<button data-index="${i}" class="${grade(questions.get(id),session.answers[id])!=='pending'?'answered':''} ${i===session.index?'current':''}" aria-label="Pregunta ${i+1}, número ${id} del banco${grade(questions.get(id),session.answers[id])!=='pending'?', respondida':''}" ${i===session.index?'aria-current="step"':''}>${i+1}</button>`).join('')}</div><div class="map-legend"><span><i></i>Pendiente</span><span><i class="filled"></i>Respondida</span></div><div class="aside-tip"><span>✳</span><h3>No saber también es avanzar.</h3><p>Marcar una duda te ayuda a enfocar tu próximo repaso.</p></div></aside></div>`;
  document.querySelectorAll('input[name="answer"]').forEach(el=>el.onchange=()=>{
    session.answers[q.id]={kind:'choice',value:el.value}; save();
    document.querySelectorAll('.option').forEach(l=>l.classList.toggle('selected',l.contains(el)));
    $('#unknown').classList.remove('selected'); $('#next').disabled=false;
    // Repaint the map without moving the reader away from the current option.
    const b = document.querySelector(`[data-index="${session.index}"]`); b?.classList.add('answered');
    b?.setAttribute('aria-label',`Pregunta ${session.index+1}, número ${q.id} del banco, respondida`);
    const count=completedCount();
    $('progress').value=count;
    $('.quiz-aside>p').innerHTML=`<b>${count}</b> de ${session.order.length} respondidas`;
  });
  $('#open-answer')?.addEventListener('input',e=>{session.answers[q.id]={kind:'draft',text:e.target.value,revealed:false};save();});
  $('#reveal')?.addEventListener('click',()=>{
    const text=$('#open-answer').value.trim();
    if(!text){toast('Escribe tu respuesta o elige «No sé la respuesta».');$('#open-answer').focus();return;}
    session.answers[q.id]={kind:'draft',text,revealed:true};save();practice();$('#self-correct').focus();
  });
  for(const correct of [true,false]) $(correct?'#self-correct':'#self-wrong')?.addEventListener('click',()=>{session.answers[q.id]={kind:'self',text:a?.text||'',correct,revealed:true};save();advance();});
  $('#unknown').onclick=()=>{session.answers[q.id]={kind:'unknown',text:$('#open-answer')?.value||''};save();advance();};
  $('#next').onclick=advance;
  $('#prev').onclick=()=>{session.index--;save();practice();focusMain();};
  document.querySelectorAll('[data-index]').forEach(el=>el.onclick=()=>{session.index=Number(el.dataset.index);save();practice();focusMain();});
}
function advance() {
  if(grade(questions.get(session.order[session.index]),session.answers[session.order[session.index]])==='pending') return;
  if(session.index < session.order.length-1){session.index++;save();practice();focusMain();return;}
  const pending=session.order.findIndex(id=>grade(questions.get(id),session.answers[id])==='pending');
  if(pending!==-1){session.index=pending;save();practice();focusMain();toast('Aún quedan preguntas por responder. Te llevé a la primera pendiente.');return;}
  session.finished=true;session.finishedAt=new Date().toISOString();save();resultFilter='review';navigate('resultados');
}

function reviewCard(q, answer, showStatus=true) {
  const g=grade(q,answer);
  const labels={correct:'Correcta',wrong:'Para reforzar',unknown:'No sabía',excluded:'Sin calificación',pending:'Sin responder'};
  const selected=answer?.kind==='unknown'?'No sé la respuesta':answer?.kind==='choice'?`${answer.value}) ${q.options.find(o=>o.id===answer.value)?.text}`:answer?.text;
  return `<article class="review-card"><div class="card-heading">${pill(`N.º ${q.id} · ${q.topic}`)}${showStatus?pill(labels[g],g):''}</div>${blocks(q)}${selected?`<div class="your-answer"><strong>Tu respuesta${q.type==='open'?' · autoevaluada':''}</strong><p>${escape(selected)}</p></div>`:''}<details><summary>Ver respuesta y explicación</summary>${solution(q)}</details></article>`;
}
function results() {
  if(!session?.finished) return session?practice():home();
  const qs=getQuestions(), s=summarize(qs,session.answers);
  const missed=qs.filter(q=>needsReview(q,session.answers[q.id]));
  const excluded=qs.filter(q=>!q.scorable);
  const shown=resultFilter==='all'?qs:resultFilter==='excluded'?excluded:missed;
  main.innerHTML=`<div class="page-heading"><div class="eyebrow">SESIÓN COMPLETADA</div><h1>Ya sabes por dónde seguir.</h1><p class="muted">Cada duda que identificas es una oportunidad para llegar mejor preparado.</p></div><section class="result-overview"><div class="score-circle" style="--score:${s.percent||0}%"><div><strong>${s.percent??'—'}<small>${s.percent===null?'':'%'}</small></strong><span>tu puntaje</span></div></div><div class="score-detail"><h2>${s.correct} de ${s.denominator} respuestas correctas</h2><p>${s.automaticCorrect}/${s.automaticTotal} en calificación automática · ${s.selfCorrect}/${s.selfTotal} abiertas autoevaluadas</p><div class="score-chips">${pill(`${s.correct} correctas`,'correct')}${pill(`${s.wrong} incorrectas`,'wrong')}${pill(`${s.unknown} no sabía`,'unknown')}${s.excluded?pill(`${s.excluded} sin calificación`):''}</div><p class="fine">Cada pregunta evaluable vale un punto. «No sé» e incorrectas valen cero. Las preguntas sin calificación se excluyen del denominador.</p></div></section>
    <section class="review-toolbar"><div><h2>Tu lista de repaso <span class="count-badge">${missed.length}</span></h2><p class="muted">Incluye lo que respondiste mal y lo que aún no sabías.</p></div><div class="actions"><button id="copy-review" class="primary" ${missed.length?'':'disabled'}>Copiar preguntas y respuestas ↗</button><button id="retry" class="secondary" ${missed.length?'':'disabled'}>Practicar esta lista</button></div></section><div class="filter-row" aria-label="Filtrar resultados"><button data-filter="review" class="filter ${resultFilter==='review'?'active':''}" aria-pressed="${resultFilter==='review'}">Por repasar (${missed.length})</button><button data-filter="all" class="filter ${resultFilter==='all'?'active':''}" aria-pressed="${resultFilter==='all'}">Todas (${qs.length})</button>${excluded.length?`<button data-filter="excluded" class="filter ${resultFilter==='excluded'?'active':''}" aria-pressed="${resultFilter==='excluded'}">Con observaciones (${excluded.length})</button>`:''}<a href="#inicio" class="new-practice">Nueva práctica →</a></div><div id="result-list">${shown.length?shown.map(q=>reviewCard(q,session.answers[q.id])).join(''):'<div class="empty-state"><span>✳</span><h2>Sin preguntas pendientes.</h2><p>Completaste esta práctica sin errores ni respuestas «No sé». Puedes iniciar otra sesión para seguir reforzando.</p></div>'}</div>`;
  $('#copy-review').onclick=()=>openExport(missed,session.answers);
  $('#retry').onclick=()=>start(missed.map(q=>q.id),'Repaso de pendientes');
  document.querySelectorAll('[data-filter]').forEach(el=>el.onclick=()=>{resultFilter=el.dataset.filter;results();});
}

function browse() {
  main.innerHTML=`<div class="page-heading"><div class="eyebrow">TU MATERIAL DE ESTUDIO</div><h1>Una pregunta a la vez.</h1><p class="muted">Explora el banco, consulta las explicaciones y resuelve tus dudas.</p></div><div class="search-tools"><label class="search-label">Buscar una pregunta<input type="search" id="search" placeholder="Busca por concepto o número…"></label><label>Área<select id="browse-topic"><option value="all">Todas las áreas</option>${topics.map(t=>`<option>${t}</option>`).join('')}</select></label><label>Formato<select id="browse-type"><option value="all">Todos los formatos</option><option value="choice">Opción múltiple</option><option value="boolean">Verdadero o falso</option><option value="open">Respuesta abierta</option></select></label></div><p id="search-count" class="muted" role="status"></p><div id="bank-list"></div>`;
  const update=()=>{
    const term=$('#search').value.trim().toLocaleLowerCase('es');
    const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const qs=bank.questions.filter(q=>($('#browse-topic').value==='all'||q.topic===$('#browse-topic').value)&&($('#browse-type').value==='all'||q.type===$('#browse-type').value)&&(/^\d+$/.test(term)?String(q.id)===term:normalize(q.prompt.map(b=>b.text||'').join(' ')).includes(normalize(term))));
    $('#search-count').textContent=`${qs.length} preguntas encontradas`;
    $('#bank-list').innerHTML=qs.length?qs.map(q=>reviewCard(q,null,false)).join(''):'<div class="empty-state"><h2>No hay coincidencias</h2><p>Prueba otra palabra o cambia los filtros.</p></div>';
  };
  $('#search').oninput=update;$('#browse-topic').onchange=update;$('#browse-type').onchange=update;update();
}
function revision() {
  const observed=bank.questions.filter(q=>q.reviewNote);
  main.innerHTML=`<div class="page-heading"><div class="eyebrow">CLARIDAD ANTES QUE MEMORIZACIÓN</div><h1>Sobre las respuestas.</h1><p class="muted">Una clave de estudio que conserva el contexto del documento original.</p></div><div class="reading-panel"><h2>El Word sí incluía respuestas</h2><p>Se extrajeron sus 147 preguntas y 13 tablas. Se conservaron las opciones originales, las respuestas del documento y las correcciones por separado en el JSON. Las preguntas abiertas no se convirtieron en preguntas de opción múltiple inventadas.</p><h2>Tres pasadas de revisión</h2><ol>${bank.review.passes.map(p=>`<li>${escape(p)}</li>`).join('')}</ol><p>${escape(bank.review.notice)}</p><h2>Cómo se calcula el puntaje</h2><p>Aciertos ÷ preguntas evaluables × 100. Se cuenta un punto por respuesta correcta y cero por incorrecta o «No sé». Las abiertas usan tu autoevaluación y se muestran por separado. La pregunta 55 queda fuera del denominador. En la 118 se aceptan B y C por ser equivalentes.</p><h2>Tu información</h2><p>La práctica se guarda en el almacenamiento local de este navegador. No se envían tus respuestas a un servidor. Al empezar una sesión nueva se reemplaza la anterior: copia tu lista de repaso si quieres conservarla. Borrar los datos del navegador también borra el progreso. No hay sincronización entre dispositivos.</p><a class="secondary" href="./data/questions.json" download="banco-preguntas.json">Descargar banco JSON ↓</a></div><div class="section-heading"><h2>Aclaraciones por pregunta</h2><span class="muted">${observed.length} observaciones</span></div>${observed.map(q=>`<article class="revision-item"><h3>N.º ${q.id} · ${escape(q.topic)}</h3>${notes(q)}</article>`).join('')}`;
}

function openExport(qs, answers) {
  exportText=exportQuestions(qs,answers);$('#export-text').value=exportText;$('#copy-status').textContent='';$('#export-dialog').showModal();copyText();
}
async function copyText() {
  try { await navigator.clipboard.writeText(exportText);$('#copy-status').textContent='✓ Copiado. Ya puedes pegarlo en ChatGPT.';toast('Preguntas y respuestas copiadas.'); }
  catch { $('#export-text').focus();$('#export-text').select();$('#copy-status').textContent='El navegador no permitió copiar automáticamente. Usa Ctrl+C (o mantén pulsado para copiar), o descarga el archivo.'; }
}
$('#close-export').onclick=()=>$('#export-dialog').close();
$('#copy-dialog').onclick=copyText;
$('#download-dialog').onclick=()=>{
  const url=URL.createObjectURL(new Blob([exportText],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='mi-repaso-examen-grado.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
function render() {
  const route=location.hash.slice(1)||'inicio';
  document.querySelectorAll('[data-nav]').forEach(el=>{
    const selected=el.dataset.nav===route || (el.dataset.nav==='inicio'&&['practica','resultados'].includes(route));
    if(selected)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
  });
  ({inicio:home,practica:practice,resultados:results,banco:browse,revision}[route]||home)();focusMain();
}
async function boot() {
  try {
    const response=await fetch(new URL('./data/questions.json',import.meta.url));
    if(!response.ok)throw new Error('HTTP '+response.status);
    bank=await response.json();questions=new Map(bank.questions.map(q=>[q.id,q]));
    try {
      const saved=JSON.parse(localStorage.getItem(KEY)||'null');
      if(validSession(saved,bank))session=saved;
      else if(saved)toast('El banco cambió o la sesión guardada no era válida. Puedes iniciar una práctica nueva.');
    } catch { storageOK=false;toast('No se pudo recuperar el progreso anterior. Puedes iniciar una práctica nueva.'); }
    window.addEventListener('hashchange',render);render();
  } catch(error) {
    main.innerHTML='<div class="empty-state"><h1>No pudimos cargar el banco</h1><p>Comprueba tu conexión y recarga la página. Si abriste el archivo con doble clic, usa GitHub Pages o un servidor local como <code>python -m http.server 8000</code>.</p><button class="primary" id="reload">Volver a intentar</button></div>';
    $('#reload').onclick=()=>location.reload();console.error('Carga del banco:',error);
  }
}
boot();
