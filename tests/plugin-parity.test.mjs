import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The Figma plugin exists twice on purpose: `figma-plugin/` is the standalone project that ships
 * in the download ZIP, and `src/figma-plugin/` is the same code type-checked by the repository's
 * own TypeScript config. These tests keep the two honest — `npm run build:figma` re-mirrors them.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

test('the mirrored plugin sources match the project that ships', async () => {
  assert.equal(await read('src/figma-plugin/main.ts'), await read('figma-plugin/code.ts'));
  for (const name of ['placement.ts', 'variable-codec.ts']) {
    assert.equal(await read(`src/figma-plugin/${name}`), await read(`figma-plugin/${name}`), name);
  }
  const mirror = await read('src/figma-plugin/tokens.ts');
  const project = await read('figma-plugin/tokens.ts');
  assert.equal(
    mirror.replace("from '../../tokens/forma.tokens.json'", "from './forma.tokens.json'"),
    project,
    'tokens.ts differs only by where it reads the canonical source'
  );
});

test('the guide embeds the panel that actually ships', async () => {
  assert.equal(await read('public/plugin/ui.html'), await read('figma-plugin/ui.html'));
  assert.equal(
    await read('public/plugin/forma.tokens.json'),
    await read('tokens/forma.tokens.json')
  );
});

test('the plugin bundles the canonical token source', async () => {
  assert.equal(await read('figma-plugin/forma.tokens.json'), await read('tokens/forma.tokens.json'));
  assert.equal(await read('public/tokens/forma.tokens.json'), await read('tokens/forma.tokens.json'));
});

test('the compiled plugin carries the current source', async () => {
  const source = await read('figma-plugin/code.ts');
  const bundle = await read('figma-plugin/code.js');
  // Every credit, board and handoff reference in the source has to survive the bundle.
  for (const marker of [
    'Lulamile Mkhungela',
    'Forma · Foundations',
    'Forma · Component library',
    'Forma · Composed patterns',
    'forma-actions-button',
    'src/system/components.tsx',
    'I built Forma so design and code could stop translating each other.',
    'Every token, drawn once'
  ]) {
    assert.ok(source.includes(marker) || bundle.includes(marker), `${marker} is in the source`);
    assert.ok(bundle.includes(marker), `${marker} is in the compiled plugin`);
  }
  // The bundled tokens are inlined, so the compiled plugin works with no file access.
  assert.ok(bundle.includes('colorSpace') || bundle.includes('srgb'), 'the token source is inlined');
});

test('the plugin points at files that exist in this repository', async () => {
  const source = await read('figma-plugin/code.ts');
  // Only complete literal paths: the Angular file name is built per component below.
  const literal = [...source.matchAll(/(?:examples\/angular|src|tokens|docs)\/[\w./-]+\.[A-Za-z]+/g)].map(
    (match) => match[0]
  );
  assert.ok(literal.length > 0, 'the plugin names real repository paths');
  for (const file of new Set(literal)) {
    await assert.doesNotReject(readFile(path.join(root, file)), `${file} exists`);
  }
});

test('every Angular adapter the plugin names really exists', async () => {
  const source = await read('figma-plugin/code.ts');
  const adapters = source.match(/const angularAdapters = new Set<ComponentId>\(\[([^\]]*)\]\)/);
  assert.ok(adapters, 'the plugin declares which components have Angular adapters');
  const ids = [...adapters[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.deepEqual(ids.sort(), ['alert', 'badge', 'button', 'checkbox', 'select', 'switch', 'text-field']);
  for (const id of ids) {
    const file =
      id === 'badge' || id === 'alert'
        ? 'examples/angular/src/forma-feedback.component.ts'
        : `examples/angular/src/forma-${id}.component.ts`;
    const contents = await read(file);
    assert.ok(contents.includes(`selector: 'forma-${id}'`), `${file} declares <forma-${id}>`);
  }
});

test('every Storybook story id the plugin writes resolves to a real story title', async () => {
  const source = await read('figma-plugin/code.ts');
  const slugs = [...source.matchAll(/'(forma-[a-z0-9-]+)'/g)].map((match) => match[1]);
  assert.ok(slugs.length >= 16, 'the plugin maps all 16 sets to a story id');
  const files = (await readdir(path.join(root, 'src/system'))).filter((file) =>
    file.endsWith('.stories.tsx')
  );
  const stories = await Promise.all(files.map((file) => read(`src/system/${file}`)));
  // Storybook turns 'Forma / Actions / Button' into 'forma-actions-button'.
  const titles = stories
    .join('\n')
    .split('\n')
    .filter((line) => line.includes("title: '"))
    .map((line) =>
      line
        .split("title: '")[1]
        .split("'")[0]
        .toLowerCase()
        .split(' / ')
        .join('-')
        .replace(/[^a-z0-9-]/g, '-')
    );
  assert.ok(titles.length >= 11, 'the React stories are present');
  for (const slug of new Set(slugs)) {
    assert.ok(titles.includes(slug), `${slug} matches a real story title`);
  }
});
