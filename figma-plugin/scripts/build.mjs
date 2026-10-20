// Forma standalone Figma build · Created by Lulamile Mkhungela.
import { build, context } from 'esbuild';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const watch = process.argv.includes('--watch');
async function checkProject() {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'));
  if (
    manifest.main !== 'code.js' ||
    manifest.ui !== 'ui.html' ||
    typeof manifest.id !== 'string' ||
    !/^\d{5,32}$/.test(manifest.id)
  ) {
    throw new Error(
      'Keep main: code.js, ui: ui.html and your real Figma-assigned string plugin ID in manifest.json.',
    );
  }
  if (manifest.networkAccess?.allowedDomains?.join(',') !== 'none') {
    throw new Error('Forma is offline. Keep networkAccess.allowedDomains set to ["none"].');
  }
  await fs.access(path.join(root, 'ui.html'));
  execFileSync(
    process.execPath,
    [
      path.join(root, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '-p',
      path.join(root, 'tsconfig.json'),
    ],
    { cwd: root, stdio: 'inherit' },
  );
}
const options = {
  absWorkingDir: root,
  entryPoints: ['code.ts'],
  outfile: 'code.js',
  // esbuild normally removes old output on failure. Publish only successful bytes ourselves.
  write: false,
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2019',
  // Keep credits and board names readable UTF-8 in the bundle instead of \u escapes.
  charset: 'utf8',
  legalComments: 'inline',
  plugins: [
    {
      name: 'forma-typecheck-and-manifest',
      setup(builder) {
        builder.onLoad({ filter: /[/\\]code\.ts$/ }, async (args) => ({
          contents: await fs.readFile(args.path, 'utf8'),
          loader: 'ts',
          resolveDir: path.dirname(args.path),
          watchFiles: [path.join(root, 'ui.html'), path.join(root, 'manifest.json')],
        }));
        builder.onEnd(async (result) => {
          if (result.errors.length) return;
          // Check after dependency discovery so a failed check still watches the invalid input
          // and can recover when it is fixed. Nothing is published until all checks pass.
          await checkProject();
          const outfile = path.join(root, 'code.js');
          const output = result.outputFiles?.find((file) => file.path === outfile);
          if (!output) throw new Error('The bundler did not produce code.js.');
          const temporary = `${outfile}.tmp`;
          await fs.writeFile(temporary, output.contents);
          await fs.rename(temporary, outfile);
          console.log(
            'Forma: build succeeded → code.js. Restart the development plugin in Figma to load changes.',
          );
        });
      },
    },
  ],
};

if (watch) {
  const session = await context(options);
  await session.watch();
  console.log('Forma: watching source, token JSON, UI and manifest. Press Ctrl+C to stop.');
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.on(signal, async () => {
      await session.dispose();
      process.exit(0);
    });
} else {
  await build(options);
}
