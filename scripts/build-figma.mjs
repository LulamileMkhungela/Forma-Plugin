import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

/**
 * Packages `figma-plugin/` — the Forma plugin project by Lulamile Mkhungela, exactly as supplied
 * in the reference repository (github.com/LulamileMkhungela/Forma, commit ef15be62a9c2f8598157ce94d940e57b7281ad85)
 * — into `public/downloads/forma-figma-plugin.zip`.
 *
 * The packaged files are copied verbatim: `code.js` is the author's compiled bundle of `code.ts`,
 * and this script never regenerates or rewrites it. Images are deliberately excluded from the ZIP.
 * Run `npm test` to verify the download still matches the vendored project byte for byte.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginRoot = path.join(root, 'figma-plugin');
const packagePath = path.join(root, 'public/downloads/forma-figma-plugin.zip');
const expectedPluginId = '1690885096816846170';

// The complete package contents: the reference project's text files, without any images.
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

async function listFiles(directory, prefix = '') {
  const entries = await fs.readdir(path.join(directory, prefix), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await listFiles(directory, relative)));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}

const manifest = JSON.parse(await fs.readFile(path.join(pluginRoot, 'manifest.json'), 'utf8'));
if (manifest.main !== 'code.js' || manifest.ui !== 'ui.html' || manifest.id !== expectedPluginId) {
  throw new Error('The Forma Figma manifest must keep the supplied plugin ID and its code.js/ui.html entry points.');
}
if (manifest.name !== 'Forma Design System · Lulamile Mkhungela') {
  throw new Error('The Forma Figma manifest must keep the credited plugin name.');
}
if (manifest.networkAccess?.allowedDomains?.join(',') !== 'none') {
  throw new Error('Forma is offline-first. Keep networkAccess.allowedDomains set to ["none"].');
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
      : `The plugin package holds files that are not part of the reference project: ${unexpected.join(', ')}`
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
  `Packaged the Forma Figma plugin (${entries.length} files, no images) at public/downloads/forma-figma-plugin.zip.`
);
