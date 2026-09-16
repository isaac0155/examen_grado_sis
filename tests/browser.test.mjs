const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.TEST_URL || 'http://127.0.0.1:8765';
await fs.mkdir('work', {recursive:true});
const bank=JSON.parse(await fs.readFile(new URL('../data/questions.json',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || 'msedge'});
const context=await browser.newContext({viewport:{width:1440,height:1100},permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base);await page.getByRole('button',{name:'Empezar práctica'}).waitFor();
await page.screenshot({path:'work/home-desktop.png',fullPage:true});
await page.selectOption('#count-select','10');await page.click('#start-form button');await page.waitForSelector('#unknown');
let initial=await page.evaluate(()=>JSON.parse(localStorage.getItem('grado.session.v1')));
assert.equal(initial.order.length,10);assert.equal(new Set(initial.order).size,10);
await page.click('#unknown');await page.reload();await page.waitForSelector('#unknown');
let restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('grado.session.v1')));
assert.equal(restored.index,1);assert.deepEqual(restored.order,initial.order);assert.equal(restored.answers[initial.order[0]].kind,'unknown');
await page.screenshot({path:'work/question-desktop.png',fullPage:true});

// Controlled mixed session uses the same public persisted format as normal sessions.
const fixture={version:bank.version,order:[1,2,28,55,118,84,144],index:0,answers:{},finished:false,label:'Prueba integral'};
await page.evaluate(s=>localStorage.setItem('grado.session.v1',JSON.stringify(s)),fixture);await page.reload();await page.waitForSelector('#unknown');
await page.locator('.option').filter({has:page.locator('input[value="B"]')}).click();await page.click('#next');
await page.locator('.option').filter({has:page.locator('input[value="A"]')}).click();await page.click('#next');
await page.fill('#open-answer','Las unitarias prueban una unidad aislada; las de integración, la colaboración entre módulos.');
await page.reload();await page.waitForSelector('#open-answer');assert.match(await page.inputValue('#open-answer'),/integración/);
await page.click('#reveal');await page.reload();await page.waitForSelector('#self-correct');await page.click('#self-correct');
await page.click('#unknown');
await page.locator('.option').filter({has:page.locator('input[value="C"]')}).click();await page.click('#next');
await page.click('#unknown');
assert.ok(await page.locator('.option-text').allTextContents().then(a=>a.includes('<a>')));
await page.locator('.option').filter({has:page.locator('input[value="C"]')}).click();await page.click('#next');
await page.waitForSelector('.result-overview');
assert.match(await page.locator('.score-detail h2').textContent(),/4 de 6/);
assert.equal(await page.locator('#result-list .review-card').count(),3);
await page.click('#copy-review');await page.waitForSelector('#export-dialog[open]');
let exported=await page.inputValue('#export-text');assert.ok(exported.includes('Pregunta 2'));assert.ok(exported.includes('Pregunta 84'));assert.ok(exported.includes('[CORRECTA]'));assert.ok(exported.includes('Pregunta 55'));assert.ok(exported.includes('SIN OPCIÓN VÁLIDA CONFIRMADA'));
assert.equal((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n'),exported);
await page.click('#close-export');await page.screenshot({path:'work/results-desktop.png',fullPage:true});
await page.click('#retry');await page.waitForSelector('#unknown');const retry=await page.evaluate(()=>JSON.parse(localStorage.getItem('grado.session.v1')));assert.deepEqual(retry.order.sort((a,b)=>a-b),[2,55,84]);

// Complete all 147 through the UI: no missing questions, no premature finish.
await page.evaluate(()=>localStorage.removeItem('grado.session.v1'));await page.goto(base+'/#inicio');await page.reload();await page.waitForSelector('#start-form');await page.click('#start-form button');
for(let i=0;i<147;i++) await page.click('#unknown');
await page.waitForSelector('.result-overview');assert.match(await page.locator('.score-detail h2').textContent(),/0 de 146/);
assert.equal(await page.locator('#result-list .review-card').count(),147);
await page.click('#copy-review');assert.ok((await page.inputValue('#export-text')).includes('Pregunta 147'));await page.click('#close-export');
console.log('Desktop: mixed scores, self-assessment, persistence, clipboard, retry and full 147-question run passed.');

await page.goto(base+'/#banco');await page.waitForSelector('#search');await page.fill('#search','31');assert.equal(await page.locator('#bank-list .review-card').count(),1);assert.equal(await page.locator('#bank-list table').count(),1);
await page.fill('#search','50');await page.locator('summary').click();assert.ok((await page.locator('#bank-list').textContent()).includes('cadena AS ('));
await page.selectOption('#browse-type','open');await page.fill('#search','');assert.equal(await page.locator('#bank-list .review-card').count(),12);

const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:1});const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));
await mp.goto(base);await mp.waitForSelector('#start-form');await mp.screenshot({path:'work/home-mobile.png',fullPage:true});
assert.ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await mp.evaluate(s=>localStorage.setItem('grado.session.v1',JSON.stringify(s)),{...fixture,order:[31,72],index:0,answers:{}});await mp.goto(base+'/#practica');await mp.reload();await mp.waitForSelector('#unknown');
assert.equal(await mp.locator('table').count(),1);assert.ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await mp.screenshot({path:'work/question-mobile.png',fullPage:true});await mp.click('#unknown');await mp.fill('#open-answer','No lo recuerdo bien');await mp.click('#reveal');await mp.screenshot({path:'work/open-mobile.png',fullPage:true});await mp.click('#self-wrong');await mp.waitForSelector('#copy-review');
await mp.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('blocked'))},configurable:true});});await mp.click('#copy-review');await mp.waitForSelector('#export-dialog[open]');await mp.waitForFunction(()=>document.querySelector('#copy-status').textContent.includes('Ctrl+C'));assert.ok((await mp.inputValue('#export-text')).includes('101 | VL-500'));
const downloadPromise=mp.waitForEvent('download');await mp.click('#download-dialog');const dl=await downloadPromise;assert.equal(dl.suggestedFilename(),'mi-repaso-examen-grado.txt');await mp.click('#close-export');
assert.deepEqual(errors,[]);console.log('Mobile: no horizontal overflow; tables, open questions, clipboard fallback and download passed.');
await browser.close();
