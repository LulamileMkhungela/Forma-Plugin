import sourceTokens from '../../tokens/forma.tokens.json';

export interface TokenRecord {
  path: string[];
  name: string;
  type: string;
  value: unknown;
  rawValue: unknown;
  description?: string;
}

interface RawToken {
  path: string[];
  name: string;
  type: string;
  value: unknown;
  description?: string;
}

function flatten(group: Record<string, unknown>, prefix: string[] = [], inheritedType?: string, tokens: RawToken[] = []): RawToken[] {
  const localType = typeof group.$type === 'string' ? group.$type : inheritedType;
  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith('$')) continue;
    const path = [...prefix, key];
    if (value && typeof value === 'object' && '$value' in value) {
      const token = value as { $value: unknown; $type?: string; $description?: string };
      tokens.push({ path, name: path.join('.'), type: token.$type ?? localType ?? 'other', value: token.$value, description: token.$description });
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value as Record<string, unknown>, path, localType, tokens);
    }
  }
  return tokens;
}

const rawTokens = flatten(sourceTokens as unknown as Record<string, unknown>);
const rawByName = new Map(rawTokens.map((token) => [token.name, token]));

function resolve(value: unknown, seen = new Set<string>()): unknown {
  if (typeof value === 'string') {
    const reference = value.match(/^\{([^{}]+)\}$/);
    if (reference) {
      const path = reference[1];
      if (seen.has(path)) return value;
      const target = rawByName.get(path);
      return target ? resolve(target.value, new Set(seen).add(path)) : value;
    }
  }
  return value;
}

function toHex(value: unknown): string {
  if (!value || typeof value !== 'object' || !('components' in value)) return String(value);
  const color = value as { components: number[]; alpha: number };
  const channels = color.components.map((channel) => Math.round(Math.max(0, Math.min(1, channel)) * 255).toString(16).padStart(2, '0')).join('');
  const alpha = color.alpha < 1 ? Math.round(color.alpha * 255).toString(16).padStart(2, '0') : '';
  return `#${channels}${alpha}`.toUpperCase();
}

function displayValue(value: unknown, type: string): unknown {
  if (type === 'color') return toHex(value);
  if ((type === 'dimension' || type === 'duration') && value && typeof value === 'object' && 'value' in value && 'unit' in value) {
    const dimension = value as { value: number; unit: string };
    return `${dimension.value}${dimension.unit}`;
  }
  if (type === 'fontFamily' && Array.isArray(value)) {
    return value.map((family) => /^(sans-serif|serif|monospace|system-ui)$/.test(String(family)) ? family : `"${family}"`).join(', ');
  }
  return value;
}

export const allTokens: TokenRecord[] = rawTokens.map((token) => ({
  ...token,
  rawValue: token.value,
  value: displayValue(resolve(token.value, new Set([token.name])), token.type)
}));
export const colorTokens = allTokens.filter((token) => token.type === 'color');
export const tokenCount = allTokens.length;

function kebab(value: string) {
  return value.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}
export const cssTokenName = (token: TokenRecord | string) => `--${typeof token === 'string' ? token : token.path.map(kebab).join('-')}`;
export const tokenReference = (token: TokenRecord | string) => `{${typeof token === 'string' ? token : token.name}}`;
export const cssValue = (value: unknown) => {
  if (Array.isArray(value)) return value.join(', ');
  if (value && typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export const sourceTokenJson = JSON.stringify(sourceTokens, null, 2);
