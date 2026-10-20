import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import { build } from 'esbuild';

/**
 * Builds and packages the Forma Figma plugin by Lulamile Mkhungela.
 *
 * One command, root tooling only — no install inside `figma-plugin/`:
 *   1. type-check the plugin sources with the plugin's own tsconfig;
 *   2. bundle `code.ts` → `code.js` (published only when every check passes);
 *   3. mirror the sources into `src/figma-plugin/` so the root type-check covers the same code;
 *   4. package the project into `public/downloads/forma-figma-plugin.zip`, images excluded.
 *
 * `npm test` then verifies the download still matches the project byte for byte.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginRoot = path.join(root, 'figma-plugin');
const mirrorRoot = path.join(root, 'src/figma-plugin');
const packagePath = path.join(root, 'public/downloads/forma-figma-plugin.zip');
const expectedPluginId = '1690885096816846170';
const expectedName = 'Forma Design System · Lulamile Mkhungela';

// The complete package contents: the plugin project's text files, without any images.
const packageFiles = [
  '.gitattributes',
  'LICENSE',
  'README.md',
  'code.js',
  'code.ts',
  'eslint.config.cjs',
  'forma.tokens.json',
  'manifest.json',
  'package-lock.json',
  'package.json',
  'placement.ts',
  'scripts/build.mjs',
  'tokens.ts',
  'tsconfig.json',
  'ui.html',
  'variable-codec.ts'
];

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.bmp', '.svg', '.ico', '.tiff']);
// Local installs and build scratch space never ship, so they are not counted as drift.
const ignoredDirectories = new Set(['node_modules', 'dist', '.cache', '.turbo']);

const manifest = JSON.parse(await fs.readFile(path.join(pluginRoot, 'manifest.json'), 'utf8'));
if (manifest.main !== 'code.js' || manifest.ui !== 'ui.html' || manifest.id !== expectedPluginId) {
  throw new Error('The Forma Figma manifest must keep the supplied plugin ID and its code.js/ui.html entry points.');
}
if (manifest.name !== expectedName) {
  throw new Error('The Forma Figma manifest must keep the credited plugin name.');
}
if (manifest.networkAccess?.allowedDomains?.join(',') !== 'none') {
  throw new Error('Forma is offline-first. Keep networkAccess.allowedDomains set to ["none"].');
}
await fs.access(path.join(pluginRoot, 'ui.html'));

// 1 — type-check before anything is written.
execFileSync(
  process.execPath,
  [path.join(root, 'node_modules/typescript/bin/tsc'), '--noEmit', '-p', path.join(pluginRoot, 'tsconfig.json')],
  { cwd: root, stdio: 'inherit' }
);

// 2 — bundle. esbuild normally discards output on failure; publish only successful bytes.
const outfile = path.join(pluginRoot, 'code.js');
const result = await build({
  absWorkingDir: pluginRoot,
  entryPoints: ['code.ts'],
  outfile: 'code.js',
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: 'es2019',
  // Keep credits and board names readable UTF-8 in the bundle instead of \u escapes.
  charset: 'utf8',
  legalComments: 'inline'
});
if (result.errors.length > 0) throw new Error('The Forma plugin did not compile.');
const bundled = result.outputFiles?.find((file) => path.resolve(file.path) === outfile);
if (!bundled) throw new Error('The bundler did not produce code.js.');
const temporary = `${outfile}.tmp`;
await fs.writeFile(temporary, bundled.contents);
await fs.rename(temporary, outfile);

// 3 — mirror the sources so the root type-check and the shipped plugin are the same code.
await fs.mkdir(mirrorRoot, { recursive: true });
await fs.copyFile(path.join(pluginRoot, 'code.ts'), path.join(mirrorRoot, 'main.ts'));
for (const name of ['placement.ts', 'variable-codec.ts']) {
  await fs.copyFile(path.join(pluginRoot, name), path.join(mirrorRoot, name));
}
// The mirror reads the canonical token source at the repository root.
const tokensSource = await fs.readFile(path.join(pluginRoot, 'tokens.ts'), 'utf8');
await fs.writeFile(
  path.join(mirrorRoot, 'tokens.ts'),
  tokensSource.replace(
    "import source from './forma.tokens.json'",
    "import source from '../../tokens/forma.tokens.json'"
  )
);

// 3b — publish the panel itself so the guide can embed the real UI instead of a screenshot.
const previewRoot = path.join(root, 'public/plugin');
await fs.mkdir(previewRoot, { recursive: true });
await fs.copyFile(path.join(pluginRoot, 'ui.html'), path.join(previewRoot, 'ui.html'));
await fs.copyFile(path.join(pluginRoot, 'forma.tokens.json'), path.join(previewRoot, 'forma.tokens.json'));

// 4 — package.
async function listFiles(directory, prefix = '') {
  const entries = await fs.readdir(path.join(directory, prefix), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) continue;
      files.push(...(await listFiles(directory, relative)));
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.tmp')) continue;
      files.push(relative);
    }
  }
  return files;
}

const present = await listFiles(pluginRoot);
const unexpected = present.filter((file) => !packageFiles.includes(file));
const missing = packageFiles.filter((file) => !present.includes(file));
if (missing.length > 0) throw new Error(`The plugin package is incomplete: ${missing.join(', ')}`);
if (unexpected.length > 0) {
  const images = unexpected.filter((file) => imageExtensions.has(path.extname(file).toLowerCase()));
  throw new Error(
    images.length > 0
      ? `The ZIP ships the plugin without images. Remove: ${unexpected.join(', ')}`
      : `The plugin package holds files that are not part of the project: ${unexpected.join(', ')}`
  );
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZip(entries) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;
  const dosDate = (1 << 5) | 1; // 1980-01-01
  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name.replaceAll('\\', '/'));
    const compressed = deflateRawSync(data, { level: 9 });
    const checksum = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, nameBytes, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(localOffset, 42);
    centralParts.push(central, nameBytes);
    localOffset += local.length + nameBytes.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(localOffset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

const entries = [];
for (const name of [...packageFiles].sort()) {
  entries.push({ name, data: await fs.readFile(path.join(pluginRoot, name)) });
}

await fs.mkdir(path.dirname(packagePath), { recursive: true });
await fs.writeFile(packagePath, createZip(entries));

console.log(
  `Built and packaged the Forma Figma plugin (${entries.length} files, no images) at public/downloads/forma-figma-plugin.zip.`
);
