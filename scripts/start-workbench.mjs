import { spawn } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const previewTasks = [
  { label: 'Forma guide', script: 'dev:guide' },
  { label: 'React Storybook', script: 'storybook:server' }
];
const children = [];
let stopping = false;

console.log('Forma workbench starting. Vite serves the guide; Storybook serves the component stories.');
console.log('Use the printed network URLs to open each preview. Press Ctrl+C to stop both.\n');

function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill('SIGTERM');
  }
  const waitForExit = Promise.all(children.map((child) => new Promise((resolve) => {
    if (child.exitCode !== null) return resolve();
    child.once('exit', resolve);
    setTimeout(() => {
      if (child.exitCode === null) child.kill('SIGKILL');
      resolve();
    }, 2500).unref();
  })));
  void waitForExit.finally(() => process.exit(exitCode));
}

for (const task of previewTasks) {
  const child = spawn(npmCommand, ['run', task.script], { stdio: 'inherit', env: process.env });
  children.push(child);
  child.on('error', (error) => {
    console.error(`Could not start ${task.label}:`, error.message);
    stopAll(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping && (code !== 0 || signal)) {
      console.error(`${task.label} stopped unexpectedly.`);
      stopAll(code || 1);
    }
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
