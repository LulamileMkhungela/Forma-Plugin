import source from '../../tokens/forma.tokens.json' with { type: 'json' };

export type Theme = 'light' | 'dark';
export type TokenType =
  'color' | 'dimension' | 'duration' | 'number' | 'fontFamily' | 'fontWeight' | 'cubicBezier';
export interface DesignToken {
  $type: TokenType;
  $value: unknown;
  $description?: string;
}
export type TokenDocument = Record<string, unknown>;
export interface FlatToken {
  path: string;
  type: TokenType;
  value: unknown;
  description?: string;
}
export interface SRGBColor {
  colorSpace: 'srgb';
  components: [number, number, number];
  alpha: number;
}
export const defaultTokens: TokenDocument = source;
export const creator = 'Lulamile Mkhungela';

export function flattenTokens(
  document: unknown,
  prefix = '',
  inheritedType?: TokenType,
): FlatToken[] {
  if (!document || typeof document !== 'object' || Array.isArray(document)) return [];
  const obj = document as Record<string, unknown>;
  const type = (obj.$type as TokenType | undefined) ?? inheritedType;
  if ('$value' in obj)
    return [
      {
        path: prefix,
        type: type!,
        value: obj.$value,
        description: obj.$description as string | undefined,
      },
    ];
  return Object.entries(obj)
    .filter(([key]) => !key.startsWith('$'))
    .flatMap(([key, val]) => flattenTokens(val, prefix ? `${prefix}.${key}` : key, type));
}

export function hexToColor(hex: string): SRGBColor {
  if (!/^#[a-f\d]{6}$/i.test(hex))
    throw new Error('Use a six-digit hex colour, for example #27563D.');
  return {
    colorSpace: 'srgb',
    components: [1, 3, 5].map(
      (i) => Math.round((parseInt(hex.slice(i, i + 2), 16) / 255) * 1e6) / 1e6,
    ) as [number, number, number],
    alpha: 1,
  };
}

export function colorToHex(value: unknown): string {
  const c = value as SRGBColor;
  if (!c || c.colorSpace !== 'srgb' || !Array.isArray(c.components) || c.components.length !== 3)
    throw new Error('Forma supports DTCG sRGB colour values.');
  return (
    '#' +
    c.components
      .map((v) =>
        Math.round(Math.max(0, Math.min(1, v)) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  );
}

export function aliasPath(value: unknown): string | null {
  return typeof value === 'string' && /^\{[^{}]+\}$/.test(value) ? value.slice(1, -1) : null;
}

export function resolveToken(document: TokenDocument, path: string, stack: string[] = []): unknown {
  const tokens = new Map(flattenTokens(document).map((t) => [t.path, t]));
  function resolve(name: string, trail: string[]): unknown {
    if (trail.includes(name))
      throw new Error(`Circular reference: ${[...trail, name].join(' → ')}`);
    const t = tokens.get(name);
    if (!t) throw new Error(`Unknown token: ${name}`);
    const ref = aliasPath(t.value);
    if (!ref) return t.value;
    const target = tokens.get(ref);
    if (target && target.type !== t.type)
      throw new Error(`Type mismatch: ${name} (${t.type}) → ${ref} (${target.type})`);
    return resolve(ref, [...trail, name]);
  }
  return resolve(path, stack);
}

export function cssName(path: string): string {
  return (
    '--fm-' +
    path
      .replace(/^theme\.(light|dark)\./, '')
      .replace(/([a-z\d])([A-Z])/g, '$1-$2')
      .replace(/\./g, '-')
      .toLowerCase()
  );
}

export function valueToCSS(value: unknown, type: TokenType): string {
  if (type === 'color') {
    const c = value as SRGBColor;
    return c.alpha < 1
      ? `rgb(${c.components.map((v) => Math.round(v * 255)).join(' ')} / ${c.alpha})`
      : colorToHex(c);
  }
  if (type === 'dimension' || type === 'duration') {
    const v = value as { value: number; unit: string };
    return `${v.value}${v.unit}`;
  }
  if (type === 'fontFamily') {
    const generics = new Set([
      'serif',
      'sans-serif',
      'monospace',
      'cursive',
      'fantasy',
      'system-ui',
      'ui-serif',
      'ui-sans-serif',
      'ui-monospace',
      'ui-rounded',
      'emoji',
      'math',
      'fangsong',
    ]);
    return (Array.isArray(value) ? value : [value])
      .map((v) =>
        generics.has(String(v))
          ? String(v)
          : `"${String(v)
              .replace(/\\/g, '\\\\')
              .replace(/"/g, '\\"')
              .replace(/[\n\r\f]/g, ' ')}"`,
      )
      .join(', ');
  }
  if (type === 'cubicBezier') return `cubic-bezier(${(value as number[]).join(', ')})`;
  return String(value);
}

export function tokenCSSValue(
  document: TokenDocument,
  token: FlatToken,
  preserveAlias = true,
): string {
  const ref = aliasPath(token.value);
  return ref && preserveAlias
    ? `var(${cssName(ref)})`
    : valueToCSS(resolveToken(document, token.path), token.type);
}

export function themeVariables(document: TokenDocument, mode: Theme): Record<string, string> {
  return Object.fromEntries(
    flattenTokens(document)
      .filter((t) => !t.path.startsWith('theme.') || t.path.startsWith(`theme.${mode}.`))
      .map((t) => [cssName(t.path), tokenCSSValue(document, t)]),
  );
}

export function generateCSS(document: TokenDocument): string {
  assertTokens(document);
  const tokens = flattenTokens(document);
  const block = (selector: string, list: FlatToken[]) =>
    `${selector} {\n${list.map((t) => `  ${cssName(t.path)}: ${tokenCSSValue(document, t)};`).join('\n')}\n}\n`;
  return (
    `/* Forma v1.0.0 · Created by ${creator}\n * Generated from packages/tokens/tokens.json. Do not edit by hand.\n */\n\n` +
    block(
      ':root',
      tokens.filter((t) => !t.path.startsWith('theme.')),
    ) +
    '\n' +
    block(
      ':root, [data-theme="light"]',
      tokens.filter((t) => t.path.startsWith('theme.light.')),
    ) +
    '\n' +
    block(
      '[data-theme="dark"]',
      tokens.filter((t) => t.path.startsWith('theme.dark.')),
    )
  );
}

export function validateTokens(document: unknown): string[] {
  const errors: string[] = [];
  if (!document || typeof document !== 'object' || Array.isArray(document))
    return ['Token document must be a JSON object.'];
  const checkNames = (value: unknown, prefix = ''): void => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith('$')) continue;
      if (!/^[a-zA-Z\d_-]+$/.test(key) || ['__proto__', 'constructor', 'prototype'].includes(key))
        errors.push(`${prefix}${key}: invalid or reserved token/group name.`);
      checkNames(child, `${prefix}${key}.`);
    }
  };
  checkNames(document);
  const tokens = flattenTokens(document);
  if (!tokens.length) return ['No design tokens found.'];
  if (tokens.length > 5000) return ['This workspace supports up to 5,000 tokens.'];
  const types: TokenType[] = [
    'color',
    'dimension',
    'duration',
    'number',
    'fontFamily',
    'fontWeight',
    'cubicBezier',
  ];
  // Forma's v1 contract is stricter than a generic DTCG parser: previews and component CSS need these roles.
  const semanticRoles = [
    'background.canvas',
    'background.surface',
    'background.subtle',
    'background.inverted',
    'text.primary',
    'text.secondary',
    'text.muted',
    'text.inverse',
    'action.primary',
    'action.hover',
    'action.subtle',
    'action.text',
    'action.onPrimary',
    'border.default',
    'border.strong',
    'focus.ring',
    'status.success',
    'status.successSubtle',
    'status.danger',
    'status.dangerSubtle',
    'status.warning',
    'status.warningSubtle',
    'status.info',
    'status.infoSubtle',
  ];
  const required = [
    ...(['light', 'dark'] as const).flatMap((mode) =>
      semanticRoles.map((role) => `theme.${mode}.${role}`),
    ),
    'color.forest.700',
    'color.forest.900',
    'color.lime.200',
    'font.family.sans',
    'font.family.mono',
    'radius.sm',
    'radius.md',
    'radius.lg',
    'radius.xl',
    'radius.full',
    'border.width.focus',
    'motion.duration.fast',
    'component.button.radius',
    'component.button.height.sm',
    'component.button.height.md',
    'component.button.height.lg',
    'component.field.radius',
    'component.field.height',
    'component.card.radius',
    'component.card.padding',
  ];
  const paths = new Set(tokens.map((t) => t.path));
  for (const path of required)
    if (!paths.has(path)) errors.push(`Missing required Forma v1 token: ${path}`);
  for (const t of tokens) {
    if (t.path.startsWith('theme.') && !/^theme\.(light|dark)\./.test(t.path))
      errors.push(`${t.path}: Forma v1 supports only Light and Dark semantic groups.`);
    const expected = /^(color|theme)\./.test(t.path)
      ? 'color'
      : /^(space|radius|breakpoint|component|border\.width|font\.size)\./.test(t.path)
        ? 'dimension'
        : /^font\.family\./.test(t.path)
          ? 'fontFamily'
          : /^font\.weight\./.test(t.path)
            ? 'fontWeight'
            : /^font\.lineHeight\./.test(t.path)
              ? 'number'
              : /^motion\.duration\./.test(t.path)
                ? 'duration'
                : /^motion\.ease\./.test(t.path)
                  ? 'cubicBezier'
                  : undefined;
    if (expected && t.type !== expected)
      errors.push(`${t.path}: the Forma contract requires type ${expected}.`);
    if (!/^[a-zA-Z\d_.-]+$/.test(t.path))
      errors.push(
        `${t.path}: token names can contain letters, digits, underscores and hyphens only.`,
      );
    if (!types.includes(t.type)) {
      errors.push(`${t.path}: unsupported type ${String(t.type)}.`);
      continue;
    }
    try {
      const v = resolveToken(document as TokenDocument, t.path);
      if (t.type === 'color') {
        const c = v as SRGBColor;
        if (
          !c ||
          c.colorSpace !== 'srgb' ||
          !Array.isArray(c.components) ||
          c.components.length !== 3 ||
          c.components.some(
            (x) => typeof x !== 'number' || !Number.isFinite(x) || x < 0 || x > 1,
          ) ||
          typeof c.alpha !== 'number' ||
          !Number.isFinite(c.alpha) ||
          c.alpha < 0 ||
          c.alpha > 1
        )
          errors.push(
            `${t.path}: expected a DTCG sRGB colour with 3 components and an alpha from 0 to 1.`,
          );
      } else if (t.type === 'dimension' || t.type === 'duration') {
        const d = v as { value: number; unit: string };
        const allowed = t.type === 'dimension' ? ['px', 'rem'] : ['ms', 's'];
        if (
          !d ||
          typeof d.value !== 'number' ||
          !Number.isFinite(d.value) ||
          !allowed.includes(d.unit)
        )
          errors.push(`${t.path}: expected { value: number, unit: ${allowed.join(' | ')} }.`);
        else if (
          d.value < 0 &&
          (t.type === 'duration' ||
            /^(space|radius|breakpoint|component|border\.width|font\.size)\./.test(t.path))
        )
          errors.push(`${t.path}: this Forma value must be non-negative.`);
      } else if (t.type === 'fontFamily') {
        if (!(
          (typeof v === 'string' && v.trim()) ||
          (Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string' && x.trim()))
        ))
          errors.push(`${t.path}: invalid font family.`);
      } else if (t.type === 'cubicBezier') {
        if (
          !Array.isArray(v) ||
          v.length !== 4 ||
          v.some((x) => typeof x !== 'number' || !Number.isFinite(x)) ||
          v[0] < 0 ||
          v[0] > 1 ||
          v[2] < 0 ||
          v[2] > 1
        )
          errors.push(
            `${t.path}: expected four cubic Bézier values, with x values between 0 and 1.`,
          );
      } else if (typeof v !== 'number' || !Number.isFinite(v))
        errors.push(`${t.path}: expected a finite number.`);
    } catch (e) {
      errors.push((e as Error).message);
    }
  }
  // Light and Dark intentionally share names, but other collisions are ambiguous.
  for (const mode of ['light', 'dark'] as const) {
    const names = new Map<string, string>();
    for (const token of tokens.filter(
      (t) => !t.path.startsWith('theme.') || t.path.startsWith(`theme.${mode}.`),
    )) {
      const name = cssName(token.path);
      const previous = names.get(name);
      if (previous && previous !== token.path)
        errors.push(`CSS name collision: ${previous} and ${token.path} both export ${name}.`);
      names.set(name, token.path);
    }
  }
  const light = tokens
    .filter((t) => t.path.startsWith('theme.light.'))
    .map((t) => t.path.slice(12))
    .sort();
  const dark = tokens
    .filter((t) => t.path.startsWith('theme.dark.'))
    .map((t) => t.path.slice(11))
    .sort();
  if (!light.length || JSON.stringify(light) !== JSON.stringify(dark))
    errors.push('Light and dark themes must contain the same semantic token names.');
  return [...new Set(errors)];
}

export function assertTokens(document: unknown): asserts document is TokenDocument {
  const errors = validateTokens(document);
  if (errors.length) throw new Error(errors.join('\n'));
}

export function updateToken(document: TokenDocument, path: string, value: unknown): TokenDocument {
  if (!flattenTokens(document).some((t) => t.path === path))
    throw new Error(`Unknown token: ${path}`);
  const copy = JSON.parse(JSON.stringify(document)) as TokenDocument;
  let node: Record<string, unknown> = copy;
  for (const key of path.split('.')) node = node[key] as Record<string, unknown>;
  node.$value = value;
  assertTokens(copy);
  return copy;
}

export function tokensStudio(document: TokenDocument): Record<string, unknown> {
  assertTokens(document);
  const sets: Record<string, Record<string, unknown>> = { core: {}, light: {}, dark: {} };
  for (const t of flattenTokens(document)) {
    const set = t.path.startsWith('theme.light.')
      ? 'light'
      : t.path.startsWith('theme.dark.')
        ? 'dark'
        : 'core';
    const path = t.path.replace(/^theme\.(light|dark)\./, '');
    const keys = path.split('.');
    let target = sets[set];
    keys.slice(0, -1).forEach((key) => {
      target[key] ??= {};
      target = target[key] as Record<string, unknown>;
    });
    const ref = aliasPath(t.value);
    let value = ref
      ? `{${ref.replace(/^theme\.(light|dark)\./, '')}}`
      : t.type === 'color'
        ? colorToHex(t.value) +
          ((t.value as SRGBColor).alpha < 1
            ? Math.round((t.value as SRGBColor).alpha * 255)
                .toString(16)
                .padStart(2, '0')
                .toUpperCase()
            : '')
        : t.type === 'dimension' || t.type === 'duration'
          ? valueToCSS(t.value, t.type)
          : t.value;
    // Legacy Tokens Studio uses plural typography types and string font stacks.
    // The canonical DTCG document retains arrays, unitless line-height ratios and units.
    const type =
      t.type === 'fontFamily'
        ? 'fontFamilies'
        : t.type === 'fontWeight'
          ? 'fontWeights'
          : path.startsWith('font.lineHeight.')
            ? 'lineHeights'
            : t.type === 'dimension'
              ? path.startsWith('font.size.')
                ? 'fontSizes'
                : path.startsWith('space.')
                  ? 'spacing'
                  : path.startsWith('radius.') || path.endsWith('.radius')
                    ? 'borderRadius'
                    : path.startsWith('border.width.')
                      ? 'borderWidth'
                      : 'dimension'
              : t.type;
    if (!ref && t.type === 'fontFamily') value = valueToCSS(t.value, t.type);
    if (!ref && path.startsWith('font.lineHeight.'))
      value = `${Number(((t.value as number) * 100).toFixed(4))}%`;
    target[keys[keys.length - 1]] = {
      value,
      type,
      ...(t.description ? { description: t.description } : {}),
    };
  }
  return {
    ...sets,
    $themes: (['light', 'dark'] as const).map((mode) => ({
      id: `forma-${mode}`,
      name: mode === 'light' ? 'Light' : 'Dark',
      selectedTokenSets: {
        core: 'enabled',
        [mode]: 'enabled',
        [mode === 'light' ? 'dark' : 'light']: 'disabled',
      },
    })),
    $metadata: { tokenSetOrder: ['core', 'light', 'dark'] },
  };
}

export function contrastRatio(foreground: string, background: string): number {
  const luminance = (hex: string) => {
    const c = hexToColor(hex).components.map((v) =>
      v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
    );
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const a = luminance(foreground),
    b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
