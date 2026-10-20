import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const registry = await read('src/data/component-handoff.ts');
const plugin = await read('src/figma-plugin/main.ts');
const tokenSource = JSON.parse(await read('tokens/forma.tokens.json'));
const styles = `${await read('src/styles/components.css')}\n${await read('src/styles/advanced-components.css')}`;
const guide = await read('docs/component-guidelines.md');

function flatten(group, prefix = [], inheritedType = null, result = []) {
  const type = group.$type ?? inheritedType;
  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object' && Object.hasOwn(value, '$value')) {
      result.push([...prefix, key].join('.'));
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, [...prefix, key], type, result);
    }
  }
  return result;
}

const expectedSets = [
  'Button', 'Text field', 'Select', 'Checkbox', 'Radio group', 'Switch', 'Badge', 'Avatar',
  'Card', 'Tabs', 'Accordion', 'Dialog', 'Alert', 'Progress', 'Tooltip', 'Table'
];

function entriesFromRegistry() {
  return [...registry.matchAll(/\{\n    id: '([^']+)', name: '([^']+)', family: '([^']+)', figmaSet: '([^']+)', reactExport: '([^']+)',([\s\S]*?)\n  \}/g)].map((match) => ({
    id: match[1], name: match[2], family: match[3], figmaSet: match[4], reactExport: match[5], body: match[6]
  }));
}

function arrayField(body, field) {
  const match = body.match(new RegExp(`${field}: \\[([^\\]]*)\\]`));
  return match ? [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]) : [];
}

function scalarField(body, field) {
  return body.match(new RegExp(`${field}: '([^']+)'`))?.[1];
}

test('every Figma set has a concrete, connected component handoff', async () => {
  const entries = entriesFromRegistry();
  assert.equal(entries.length, expectedSets.length, 'the registry maps every plugin set exactly once');
  assert.deepEqual(entries.map((entry) => entry.figmaSet), expectedSets);
  for (const entry of entries) {
    assert.ok(plugin.includes(`'${entry.figmaSet}'`), `${entry.figmaSet} exists in the native plugin mapping`);
    assert.ok(entry.reactExport, `${entry.figmaSet} has a React export`);
    assert.ok(entry.family, `${entry.figmaSet} has a component family`);
    const tokenPaths = arrayField(entry.body, 'tokenPaths');
    assert.ok(tokenPaths.length > 0, `${entry.figmaSet} names its semantic/component tokens`);
    for (const token of tokenPaths) assert.ok(flatten(tokenSource).includes(token), `${entry.figmaSet} token ${token} exists in the canonical source`);
    const selectors = arrayField(entry.body, 'styleSelectors');
    assert.ok(selectors.length > 0, `${entry.figmaSet} names shared CSS selectors`);
    for (const selector of selectors) assert.ok(styles.includes(selector), `${entry.figmaSet} style ${selector} exists`);
    const storyFile = scalarField(entry.body, 'storyFile');
    const storyTitle = scalarField(entry.body, 'storyTitle');
    assert.ok(storyFile && storyTitle, `${entry.figmaSet} names its Storybook file and title`);
    const story = await read(storyFile);
    assert.ok(story.includes(storyTitle), `${entry.figmaSet} story title matches the index`);
    for (const storyName of arrayField(entry.body, 'storyNames')) assert.ok(story.includes(`export const ${storyName}`), `${entry.figmaSet} story ${storyName} exists`);
    const guideline = scalarField(entry.body, 'guideline');
    assert.ok(guideline && guide.includes(`{#${guideline}}`), `${entry.figmaSet} has an in-product guide anchor`);
  }
});
