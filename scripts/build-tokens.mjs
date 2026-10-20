import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'tokens/forma.tokens.json');
const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));

const dictionary = new StyleDictionary({
  source: [sourcePath],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/generated/',
      files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/tokens/scss/',
      files: [{ destination: '_forma-tokens.scss', format: 'scss/variables' }]
    }
  }
});
await dictionary.buildAllPlatforms();

function flatten(group, prefix = '', inheritedType = null, tokens = []) {
  const localType = group?.$type ?? inheritedType;
  for (const [key, value] of Object.entries(group ?? {})) {
    if (key.startsWith('$')) continue;
    const tokenPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && Object.hasOwn(value, '$value')) {
      tokens.push({
        path: tokenPath,
        name: tokenPath,
        type: value.$type ?? localType ?? 'other',
        value: value.$value,
        description: value.$description ?? ''
      });
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, tokenPath, localType, tokens);
    }
  }
  return tokens;
}

const tokens = flatten(source);
const tokenByName = new Map(tokens.map((token) => [token.name, token]));

function aliasPath(value) {
  return typeof value === 'string' && /^\{[^{}]+\}$/.test(value) ? value.slice(1, -1) : null;
}

function resolveValue(value, seen = new Set()) {
  const reference = aliasPath(value);
  if (reference) {
    if (seen.has(reference)) return value;
    const target = tokenByName.get(reference);
    return target ? resolveValue(target.value, new Set(seen).add(reference)) : value;
  }
  if (Array.isArray(value)) return value.map((item) => resolveValue(item, seen));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveValue(item, seen)]));
  }
  return value;
}

function kebab(value) {
  return value.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}
function cssVariable(pathName) {
  return `--${pathName.split('.').map(kebab).join('-')}`;
}
function asHex(value) {
  if (!value || value.colorSpace !== 'srgb' || !Array.isArray(value.components)) return String(value);
  const rgb = value.components.map((channel) => Math.round(Math.max(0, Math.min(1, channel)) * 255).toString(16).padStart(2, '0')).join('');
  const alpha = value.alpha < 1 ? Math.round(value.alpha * 255).toString(16).padStart(2, '0') : '';
  return `#${rgb}${alpha}`.toUpperCase();
}
function cssValue(token) {
  const value = token.value;
  if (token.type === 'color') return asHex(resolveValue(value));
  if (token.type === 'dimension' || token.type === 'duration') return `${value.value}${value.unit}`;
  if (token.type === 'fontFamily') {
    const families = Array.isArray(value) ? value : [value];
    return families.map((family) => /^(sans-serif|serif|monospace|system-ui)$/.test(String(family)) ? family : `"${String(family).replaceAll('"', '\\"')}"`).join(', ');
  }
  if (token.type === 'cubicBezier') return `cubic-bezier(${value.join(', ')})`;
  return String(value);
}

// Style Dictionary handles DTCG dimensions and colors natively; DTCG duration objects need
// an explicit unit-preserving post-transform in both output formats.
for (const destination of ['src/generated/tokens.css', 'dist/tokens/scss/_forma-tokens.scss']) {
  const filePath = path.join(root, destination);
  let content = await fs.readFile(filePath, 'utf8');
  for (const token of tokens.filter((entry) => entry.type === 'duration')) {
    const variable = cssVariable(token.path);
    const name = destination.endsWith('.scss') ? `$${variable.slice(2)}` : variable;
    content = content.replace(`${name}: [object Object]`, `${name}: ${cssValue(token)}`);
  }
  await fs.writeFile(filePath, content);
}

function tokensStudioExport() {
  const sets = { core: {}, light: {}, dark: {} };
  for (const token of tokens) {
    const set = token.path.startsWith('theme.light.') ? 'light' : token.path.startsWith('theme.dark.') ? 'dark' : 'core';
    const normalizedPath = token.path.replace(/^theme\.(light|dark)\./, '');
    const parts = normalizedPath.split('.');
    let target = sets[set];
    for (const part of parts.slice(0, -1)) target = (target[part] ??= {});

    const reference = aliasPath(token.value);
    let value = reference ? `{${reference.replace(/^theme\.(light|dark)\./, '')}}` : token.value;
    if (!reference && token.type === 'color') value = asHex(token.value);
    if (!reference && (token.type === 'dimension' || token.type === 'duration')) value = cssValue(token);
    if (!reference && token.type === 'fontFamily') value = cssValue(token);
    if (!reference && token.path.startsWith('font.lineHeight.')) value = `${Number((Number(token.value) * 100).toFixed(4))}%`;

    const type = token.type === 'fontFamily' ? 'fontFamilies'
      : token.type === 'fontWeight' ? 'fontWeights'
      : token.path.startsWith('font.lineHeight.') ? 'lineHeights'
      : token.type === 'dimension' && token.path.startsWith('font.size.') ? 'fontSizes'
      : token.type === 'dimension' && token.path.startsWith('space.') ? 'spacing'
      : token.type === 'dimension' && (token.path.startsWith('radius.') || token.path.endsWith('.radius')) ? 'borderRadius'
      : token.type === 'dimension' && token.path.startsWith('border.width.') ? 'borderWidth'
      : token.type;

    target[parts.at(-1)] = { value, type, ...(token.description ? { description: token.description } : {}) };
  }
  return {
    ...sets,
    $themes: ['light', 'dark'].map((mode) => ({
      id: `forma-${mode}`,
      name: mode === 'light' ? 'Light' : 'Dark',
      selectedTokenSets: { core: 'enabled', [mode]: 'enabled', [mode === 'light' ? 'dark' : 'light']: 'disabled' }
    })),
    $metadata: { tokenSetOrder: ['core', 'light', 'dark'], author: 'Lulamile Mkhungela', source: 'tokens/forma.tokens.json' }
  };
}

const figmaExportPath = path.join(root, 'tokens/figma-tokens.json');
await fs.writeFile(figmaExportPath, `${JSON.stringify(tokensStudioExport(), null, 2)}\n`);
await fs.mkdir(path.join(root, 'public/tokens'), { recursive: true });
await fs.copyFile(sourcePath, path.join(root, 'public/tokens/forma.tokens.json'));
// The offline Figma plugin bundles the same canonical source, so it can never drift.
await fs.copyFile(sourcePath, path.join(root, 'figma-plugin/forma.tokens.json'));
await fs.copyFile(figmaExportPath, path.join(root, 'public/tokens/figma-tokens.json'));
await fs.copyFile(path.join(root, 'src/generated/tokens.css'), path.join(root, 'public/tokens/forma.tokens.css'));
await fs.copyFile(path.join(root, 'dist/tokens/scss/_forma-tokens.scss'), path.join(root, 'public/tokens/forma.tokens.scss'));
console.log(`Built ${tokens.length} Forma DTCG tokens with Style Dictionary.`);
