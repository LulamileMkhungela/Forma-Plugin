import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
const source = await readJson('tokens/forma.tokens.json');
const figma = await readJson('tokens/figma-tokens.json');
const manifest = await readJson('figma-plugin/manifest.json');
const css = await readFile(path.join(root, 'src/generated/tokens.css'), 'utf8');
const publicCss = await readFile(path.join(root, 'public/tokens/forma.tokens.css'), 'utf8');
const scss = await readFile(path.join(root, 'public/tokens/forma.tokens.scss'), 'utf8');
const mirroredSource = await readJson('public/tokens/forma.tokens.json');

function flatten(group, prefix = [], inheritedType = null, result = []) {
  const type = group.$type ?? inheritedType;
  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object' && Object.hasOwn(value, '$value')) {
      result.push({ name: [...prefix, key].join('.'), type: value.$type ?? type, value: value.$value });
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, [...prefix, key], type, result);
    }
  }
  return result;
}

const tokens = flatten(source);
const byName = new Map(tokens.map((token) => [token.name, token]));

test('Forma DTCG source includes 170 typed tokens and clear creator metadata', () => {
  assert.match(source.$description, /DTCG/i);
  assert.equal(source.$extensions['com.forma'].name, 'Forma');
  assert.equal(source.$extensions['com.forma'].creator, 'Lulamile Mkhungela');
  assert.equal(source.$extensions['com.forma'].version, '1.0.0');
  assert.equal(tokens.length, 170);
  assert.ok(tokens.every((token) => token.type && token.value !== undefined), 'every token has an explicit or inherited type and value');
  assert.deepEqual(
    Object.fromEntries([...new Set(tokens.map((token) => token.type))].sort().map((type) => [type, tokens.filter((token) => token.type === type).length])),
    { color: 114, cubicBezier: 1, dimension: 43, duration: 3, fontFamily: 2, fontWeight: 4, number: 3 }
  );
});

test('source covers the actual forest/lime palette, both semantic modes and component values', () => {
  const names = new Set(tokens.map((token) => token.name));
  for (const name of [
    'color.forest.700', 'color.lime.300', 'color.neutral.950',
    'theme.light.action.primary', 'theme.dark.action.primary',
    'font.family.sans', 'font.size.display', 'font.weight.semibold',
    'space.4', 'radius.md', 'border.width.focus',
    'motion.duration.normal', 'motion.ease.standard', 'component.button.height.md'
  ]) assert.ok(names.has(name), `expected token ${name}`);
  assert.equal(byName.get('theme.light.action.primary').value, '{color.forest.700}');
  assert.equal(byName.get('theme.dark.action.primary').value, '{color.forest.200}');
  assert.deepEqual(byName.get('motion.ease.standard').value, [0.2, 0, 0, 1]);
  assert.equal(byName.get('motion.duration.normal').value.value, 180);
  assert.equal(byName.get('motion.duration.normal').value.unit, 'ms');
});

test('Tokens Studio export keeps primitive tokens and both selectable theme sets', () => {
  assert.equal(figma.$metadata.author, 'Lulamile Mkhungela');
  assert.equal(figma.$metadata.source, 'tokens/forma.tokens.json');
  assert.deepEqual(figma.$metadata.tokenSetOrder, ['core', 'light', 'dark']);
  assert.deepEqual(figma.$themes.map((theme) => theme.name), ['Light', 'Dark']);
  assert.equal(figma.core.color.forest['700'].value, '#27563D');
  assert.equal(figma.light.action.primary.value, '{color.forest.700}');
  assert.equal(figma.dark.action.primary.value, '{color.forest.200}');
  assert.equal(figma.core.motion.duration.normal.value, '180ms');
  assert.equal(figma.core.font.family.sans.type, 'fontFamilies');
  assert.equal(figma.core.font.lineHeight.normal.value, '150%');
});

test('generated CSS and Sass preserve aliases and DTCG duration units', () => {
  assert.match(css, /--color-forest-700: #27563d/);
  assert.match(css, /--theme-light-action-primary: var\(--color-forest-700\)/);
  assert.match(css, /--theme-dark-action-primary: var\(--color-forest-200\)/);
  assert.match(css, /--motion-duration-normal: 180ms/);
  assert.match(css, /--motion-ease-standard: cubic-bezier\(0\.2, 0, 0, 1\)/);
  assert.match(scss, /\$motion-duration-normal: 180ms/);
  assert.equal(publicCss, css, 'the browser download matches the app CSS');
  assert.deepEqual(mirroredSource, source, 'the public DTCG source matches the canonical file');
});

test('Figma manifest is the credited offline plugin with supplied entry points', () => {
  assert.equal(manifest.name, 'Forma Design System · Lulamile Mkhungela');
  assert.equal(manifest.id, '1690885096816846170');
  assert.equal(manifest.main, 'code.js');
  assert.equal(manifest.ui, 'ui.html');
  assert.deepEqual(manifest.networkAccess.allowedDomains, ['none']);
});

// The reference project ships `code.js` as the author's compiled bundle of `code.ts`, so the
// download must repackage those exact bytes instead of regenerating the plugin.
const pluginPackageFiles = [
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

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function readZipEntries(buffer) {
  const entries = [];
  let offset = 0;
  while (buffer.readUInt32LE(offset) === 0x04034b50) {
    const method = buffer.readUInt16LE(offset + 8);
    const crc = buffer.readUInt32LE(offset + 14);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const uncompressedSize = buffer.readUInt32LE(offset + 22);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const name = buffer.subarray(offset + 30, offset + 30 + nameLength).toString('utf8');
    const start = offset + 30 + nameLength + extraLength;
    const data = buffer.subarray(start, start + compressedSize);
    const contents = method === 8 ? inflateRawSync(data) : data;
    assert.equal(contents.length, uncompressedSize, `${name} uncompressed size`);
    entries.push({ name, contents, crc });
    offset = start + compressedSize;
  }
  assert.equal(buffer.readUInt32LE(offset), 0x02014b50, 'the ZIP central directory follows the entries');
  return entries;
}

test('the download is the supplied plugin project without images', async () => {
  const archive = await readFile(path.join(root, 'public/downloads/forma-figma-plugin.zip'));
  const entries = readZipEntries(archive);
  assert.deepEqual(
    entries.map((entry) => entry.name),
    [...pluginPackageFiles].sort(),
    'the ZIP holds every supplied project file exactly once'
  );
  for (const entry of entries) {
    assert.ok(!/\.(png|jpe?g|gif|webp|avif|bmp|svg|ico|tiff)$/i.test(entry.name), `${entry.name} is not an image`);
    const file = await readFile(path.join(root, 'figma-plugin', entry.name));
    assert.ok(file.equals(entry.contents), `${entry.name} ships the supplied bytes unchanged`);
    assert.equal(crc32(entry.contents), entry.crc, `${entry.name} checksum matches its ZIP header`);
  }
});
