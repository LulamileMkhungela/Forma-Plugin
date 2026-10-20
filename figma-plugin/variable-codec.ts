import {
  aliasPath,
  type FlatToken,
  type SRGBColor,
  type TokenDocument,
  resolveToken,
} from './tokens';

export interface VariableBinding {
  variableId: string;
  modeId: string;
}
export type VariableMap = Record<string, VariableBinding>;
export type PortableFigmaValue =
  | string
  | number
  | { r: number; g: number; b: number; a?: number }
  | { type: 'VARIABLE_ALIAS'; id: string };
export function figmaType(token: FlatToken): 'COLOR' | 'FLOAT' | 'STRING' {
  return token.type === 'color'
    ? 'COLOR'
    : ['dimension', 'duration', 'number', 'fontWeight'].includes(token.type)
      ? 'FLOAT'
      : 'STRING';
}
export function encodeFigmaValue(
  document: TokenDocument,
  token: FlatToken,
  map: VariableMap,
): PortableFigmaValue {
  const ref = aliasPath(token.value);
  if (ref) {
    if (!map[ref]) throw new Error(`Missing Figma variable mapping for ${ref}.`);
    return { type: 'VARIABLE_ALIAS', id: map[ref].variableId };
  }
  const value = resolveToken(document, token.path);
  if (token.type === 'color') {
    const c = value as SRGBColor;
    return { r: c.components[0], g: c.components[1], b: c.components[2], a: c.alpha };
  }
  if (token.type === 'dimension' || token.type === 'duration') {
    const v = value as { value: number; unit: string };
    return v.value * (v.unit === 'rem' ? 16 : v.unit === 's' ? 1000 : 1);
  }
  if (token.type === 'fontFamily') return Array.isArray(value) ? value.join(', ') : String(value);
  if (token.type === 'cubicBezier') return JSON.stringify(value);
  return Number(value);
}
export function decodeFigmaValue(
  token: FlatToken,
  value: PortableFigmaValue,
  map: VariableMap,
  original: unknown,
): unknown {
  if (typeof value === 'object' && 'type' in value && value.type === 'VARIABLE_ALIAS') {
    const paths = Object.keys(map).filter((path) => map[path].variableId === value.id);
    const mode = token.path.startsWith('theme.dark.') ? 'dark' : 'light';
    const ref = paths.find((p) => p.startsWith(`theme.${mode}.`)) ?? paths[0];
    if (!ref)
      throw new Error(
        `${token.path}: the alias targets a variable outside the Forma mapping. Replace it with a Forma variable or a literal.`,
      );
    return `{${ref}}`;
  }
  if (token.type === 'color') {
    if (typeof value !== 'object' || !('r' in value))
      throw new Error(`${token.path}: expected a colour variable.`);
    return {
      colorSpace: 'srgb',
      components: [value.r, value.g, value.b].map((x) => Math.round(x * 1e6) / 1e6),
      alpha: value.a ?? 1,
    };
  }
  if (token.type === 'dimension' || token.type === 'duration') {
    const previous = original as { unit?: string };
    const unit = previous?.unit ?? (token.type === 'dimension' ? 'px' : 'ms');
    return { value: Number(value) / (unit === 'rem' ? 16 : unit === 's' ? 1000 : 1), unit };
  }
  if (token.type === 'fontFamily')
    return typeof value === 'string'
      ? value
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
      : value;
  if (token.type === 'cubicBezier') {
    if (typeof value !== 'string')
      throw new Error(`${token.path}: the easing variable must contain a JSON array.`);
    return JSON.parse(value);
  }
  return Number(value);
}
