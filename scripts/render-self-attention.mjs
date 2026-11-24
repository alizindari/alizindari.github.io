import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src/data/blogPosts/self-attention/figures.html');
const output = path.join(root, 'public/blog/self-attention');
const figures = [
  { name: 'transformer', slide: 14, x: 52, y: 130, width: 1176, height: 490 },
  { name: 'next-token', slide: 15, x: 68, y: 143, width: 1144, height: 412 },
  { name: 'token-vectors', slide: 16, x: 335, y: 168, width: 510, height: 440 },
  { name: 'right-multiplication', slide: 17, x: 130, y: 112, width: 1055, height: 445 },
  { name: 'left-multiplication', slide: 18, x: 94, y: 96, width: 1106, height: 470 },
  { name: 'fixed-weights', slide: 20, x: 68, y: 112, width: 1144, height: 462 },
  { name: 'queries-and-keys', slide: 22, x: 192, y: 238, width: 940, height: 216 },
];
const candidates = [process.env.CHROME_BIN, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium', '/usr/bin/google-chrome'].filter(Boolean);
let chrome;
for (const candidate of candidates) {
  try { await access(candidate); chrome = candidate; break; } catch { /* Try the next installation. */ }
}
if (!chrome) throw new Error('Set CHROME_BIN to a Chromium executable.');
await mkdir(output, { recursive: true });
const temporary = await mkdtemp(path.join(tmpdir(), 'self-attention-'));
const browser = spawn(chrome, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--allow-file-access-from-files', '--remote-debugging-port=0', `--user-data-dir=${temporary}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let log = '';
browser.stderr.on('data', chunk => { log = (log + chunk).slice(-5000); });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const run = promisify(execFile);
let socket;
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = Number((await readFile(path.join(temporary, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); break; } catch { /* Chromium is still starting. */ }
    if (browser.exitCode !== null) throw new Error(log);
    await delay(100);
  }
  if (!port) throw new Error(`Chromium failed to start: ${log}`);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    const handler = pending.get(message.id);
    if (!handler) return;
    pending.delete(message.id);
    message.error ? handler.reject(new Error(JSON.stringify(message.error))) : handler.resolve(message.result);
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await call('Page.enable');
  await call('Emulation.setEmulatedMedia', { media: 'screen' });
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  for (const figure of figures) {
    await call('Page.navigate', { url: pathToFileURL(source).href });
    let ready = false;
    for (let i = 0; i < 100; i++) {
      ready = await evaluate('document.documentElement.dataset.ready === "true"');
      if (ready) break;
      await delay(100);
    }
    if (!ready) throw new Error('Figure fonts and math did not load.');
    await evaluate(`(() => {
      const figure = ${JSON.stringify(figure)};
      document.querySelectorAll('.slide').forEach(slide => slide.classList.toggle('is-active', slide.id === String(figure.slide)));
      const style = document.createElement('style');
      style.textContent = 'html,body{position:relative;contain:strict;width:' + figure.width + 'px;height:' + figure.height + 'px;overflow:hidden;background:#FAF9F6}.deck{position:absolute;left:-' + figure.x + 'px;top:-' + figure.y + 'px;transform:none}.slide{print-color-adjust:exact;-webkit-print-color-adjust:exact}.takeaway{visibility:hidden}@page{margin:0;size:' + figure.width + 'px ' + figure.height + 'px}';
      document.head.append(style);
      return document.fonts.ready.then(() => {
        if (document.querySelector('.katex-error')) throw new Error('Invalid formula');
        if (!document.fonts.check('30px "Termes Slides"')) throw new Error('Missing Termes font');
      });
    })()`);
    const pdf = await call('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, paperWidth: figure.width / 96, paperHeight: figure.height / 96, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, pageRanges: '1' });
    const pdfPath = path.join(temporary, `${figure.name}.pdf`);
    await writeFile(pdfPath, Buffer.from(pdf.data, 'base64'));
    const svgPath = path.join(output, `${figure.name}.svg`);
    await run('pdftocairo', ['-svg', '-f', '1', '-l', '1', pdfPath, svgPath]);
    const svg = await readFile(svgPath, 'utf8');
    if (/<image[\s>]|<foreignObject[\s>]|<pageSet[\s>]/.test(svg)) throw new Error(`${figure.name} is not a standalone vector image.`);
    const opaqueSvg = await evaluate(`(() => {
      const xml = new DOMParser().parseFromString(${JSON.stringify(svg)}, 'image/svg+xml');
      const background = xml.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('width', '100%');
      background.setAttribute('height', '100%');
      background.setAttribute('fill', '#FAF9F6');
      xml.documentElement.prepend(background);
      return new XMLSerializer().serializeToString(xml);
    })()`);
    await writeFile(svgPath, opaqueSvg);
    console.log(`Exported ${figure.name}.svg: pure vector paths, original slide fonts and colors.`);
  }
} finally {
  socket?.close();
  const exited = new Promise(resolve => browser.once('exit', resolve));
  if (browser.exitCode === null) { browser.kill('SIGTERM'); await exited; }
  await rm(temporary, { recursive: true, force: true });
}
