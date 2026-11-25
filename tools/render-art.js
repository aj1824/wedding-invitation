/*
  Re-generates assets/img/*.webp from tools/art.js using headless Edge or Chrome.
  Usage:  node tools/render-art.js
  (Set BROWSER_PATH if Edge/Chrome is installed somewhere unusual.)
*/
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const candidates = [
  process.env.BROWSER_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium'
].filter(Boolean);
const browser = candidates.find(p => fs.existsSync(p));
if (!browser) { console.error('No Edge/Chrome found — set BROWSER_PATH.'); process.exit(1); }

const port = 9400 + Math.floor(Math.random() * 300);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'art-'));
const page = 'file:///' + path.join(__dirname, 'render-art.html').replace(/\\/g, '/');
const outDir = path.join(__dirname, '..', 'assets', 'img');
const proc = spawn(browser, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--allow-file-access-from-files', page], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let tab;
  for (let i = 0; i < 80 && !tab; i++) {
    try { tab = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page' && t.url.includes('render-art')); } catch (_) {}
    if (!tab) await sleep(250);
  }
  if (!tab) throw new Error('browser did not start');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => (ws.onopen = r));
  let id = 0; const wait = {};
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && wait[d.id]) { wait[d.id](d.result); delete wait[d.id]; } };
  const evaluate = expression => new Promise(r => { const i = ++id; wait[i] = r; ws.send(JSON.stringify({ id: i, method: 'Runtime.evaluate', params: { expression, returnByValue: true } })); });

  for (let i = 0; i < 240; i++) {
    const s = (await evaluate('({done: !!window.__done, err: window.__err || null})')).result.value;
    if (s.err) throw new Error(s.err);
    if (s.done) break;
    await sleep(500);
  }
  const out = (await evaluate('window.__out')).result.value;
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, url] of Object.entries(out)) {
    const buf = Buffer.from(url.split(',')[1], 'base64');
    fs.writeFileSync(path.join(outDir, name), buf);
    console.log(`${name.padEnd(24)} ${(buf.length / 1024).toFixed(0)} KB`);
  }
  ws.close();
})()
  .catch(e => { console.error(e); process.exitCode = 1; })
  .finally(() => { proc.kill(); try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) {} });
