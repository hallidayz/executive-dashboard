/**
 * Spawns Vite then Electron with VITE_DEV_SERVER_URL for personal setup testing.
 */
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const root = path.join(__dirname, '..');
const port = process.env.PORT || '5173';
const url = `http://127.0.0.1:${port}`;

function waitForServer(target, attempts = 60) {
  return new Promise((resolve, reject) => {
    let left = attempts;
    const tick = () => {
      const req = http.get(target, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        left -= 1;
        if (left <= 0) reject(new Error(`Vite did not start at ${target}`));
        else setTimeout(tick, 500);
      });
    };
    tick();
  });
}

const vite = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', port], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
});

let electronProc = null;

waitForServer(url)
  .then(() => {
    electronProc = spawn('npx', ['electron', '.'], {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        VITE_DEV_SERVER_URL: url,
        OPEN_AT_LOGIN: 'false',
      },
    });
    electronProc.on('exit', (code) => {
      vite.kill('SIGTERM');
      process.exit(code ?? 0);
    });
  })
  .catch((err) => {
    console.error(err.message || err);
    vite.kill('SIGTERM');
    process.exit(1);
  });

function shutdown() {
  if (electronProc) electronProc.kill('SIGTERM');
  vite.kill('SIGTERM');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
