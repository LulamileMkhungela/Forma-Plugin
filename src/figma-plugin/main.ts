import {
  assertTokens,
  defaultTokens,
  flattenTokens,
  resolveToken,
  type SRGBColor,
  type Theme,
  type TokenDocument,
} from './tokens';
import {
  decodeFigmaValue,
  encodeFigmaValue,
  figmaType,
  type PortableFigmaValue,
  type VariableMap,
} from './variable-codec';
import {
  FORMA_BOARD_NAMES,
  FORMA_PAGE_NAMES,
  SINGLE_PAGE_CAPTION,
  assignBoards,
  isPlacementPreference,
  placementNotice,
  placementSummary,
  reservePages,
  resolvePlacement,
  type PlacementKind,
  type PlacementPreference,
} from './placement';

const OWNER = 'Lulamile Mkhungela';
const ids = [
  'button',
  'text-field',
  'select',
  'checkbox',
  'radio-group',
  'switch',
  'badge',
  'avatar',
  'card',
  'tabs',
  'accordion',
  'dialog',
  'alert',
  'progress',
  'tooltip',
  'table',
] as const;
type ComponentId = (typeof ids)[number];
const names: Record<ComponentId, string> = {
  button: 'Button',
  'text-field': 'Text field',
  select: 'Select',
  checkbox: 'Checkbox',
  'radio-group': 'Radio group',
  switch: 'Switch',
  badge: 'Badge',
  avatar: 'Avatar',
  card: 'Card',
  tabs: 'Tabs',
  accordion: 'Accordion',
  dialog: 'Dialog',
  alert: 'Alert',
  progress: 'Progress',
  tooltip: 'Tooltip',
  table: 'Table',
};
const exports: Record<ComponentId, string> = {
  button: 'Button',
  'text-field': 'TextField',
  select: 'SelectField',
  checkbox: 'Checkbox',
  'radio-group': 'RadioGroup',
  switch: 'Switch',
  badge: 'Badge',
  avatar: 'Avatar',
  card: 'Card',
  tabs: 'Tabs',
  accordion: 'Accordion',
  dialog: 'Dialog',
  alert: 'Alert',
  progress: 'Progress',
  tooltip: 'Tooltip',
  table: 'Table',
};
const storySlugs: Record<ComponentId, string> = {
  button: 'forma-actions-button',
  'text-field': 'forma-forms-text-field',
  select: 'forma-forms-text-field',
  checkbox: 'forma-forms-selection-controls',
  'radio-group': 'forma-forms-radio-group',
  switch: 'forma-forms-selection-controls',
  badge: 'forma-feedback',
  avatar: 'forma-feedback',
  card: 'forma-feedback',
  tabs: 'forma-navigation-tabs',
  accordion: 'forma-navigation-accordion',
  dialog: 'forma-overlays-dialog',
  alert: 'forma-feedback',
  progress: 'forma-feedback-progress',
  tooltip: 'forma-overlays-tooltip',
  table: 'forma-data-display-table',
};
const angularAdapters = new Set<ComponentId>(['button', 'text-field', 'select', 'checkbox', 'switch', 'badge', 'alert']);
function angularUsage(id: ComponentId): string {
  if (!angularAdapters.has(id)) return 'Angular native markup + shared CSS';
  const file = id === 'badge' || id === 'alert' ? 'forma-feedback.component.ts' : `forma-${id}.component.ts`;
  return `Angular <forma-${id}> (examples/angular/src/${file})`;
}
function angularSelector(id: ComponentId): string {
  return angularAdapters.has(id) ? `forma-${id}` : 'native';
}
function codeRef(id: ComponentId): string {
  return `React ${exports[id]} (src/system/components.tsx) · ${angularUsage(id)}`;
}
let document: TokenDocument = defaultTokens;
let bindings: VariableMap = {};
let variables = new Map<string, Variable>();
let collections = new Map<string, VariableCollection>();
let font: FontName = { family: 'Inter', style: 'Regular' };
let medium: FontName = { family: 'Inter', style: 'Medium' };
let bold: FontName = { family: 'Inter', style: 'Bold' };
let busy = false;
let warnings: string[] = [];

const progress = (message: string) => figma.ui.postMessage({ type: 'progress', message });
const jsonClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const themePath = (key: string, mode: Theme = 'light') => `theme.${mode}.${key}`;
function dimension(path: string): number {
  const value = resolveToken(document, path) as { value: number; unit: string };
  return value.value * (value.unit === 'rem' ? 16 : 1);
}
function rgb(path: string): RGBA {
  const value = resolveToken(document, path) as SRGBColor;
  return { r: value.components[0], g: value.components[1], b: value.components[2], a: value.alpha };
}
function paint(path: string): SolidPaint {
  const value = rgb(path);
  const literal: SolidPaint = {
    type: 'SOLID',
    color: { r: value.r, g: value.g, b: value.b },
    opacity: value.a,
  };
  const variable = variables.get(path);
  return variable ? figma.variables.setBoundVariableForPaint(literal, 'color', variable) : literal;
}
function fills(node: GeometryMixin, path: string): void {
  node.fills = [paint(path)];
}
function radius(
  node: FrameNode | ComponentNode | ComponentSetNode | RectangleNode,
  path = 'radius.md',
): void {
  node.cornerRadius = dimension(path);
  const variable = variables.get(path);
  if (variable) node.setBoundVariable('cornerRadius', variable);
}
function border(
  node: FrameNode | ComponentNode | ComponentSetNode | RectangleNode,
  mode: Theme = 'light',
): void {
  node.strokes = [paint(themePath('border.default', mode))];
  node.strokeWeight = 1;
}
function applyMode(node: FrameNode | ComponentNode | ComponentSetNode, mode: Theme): void {
  for (const c of collections.values()) {
    const m = c.modes.find((m) => m.name === (mode === 'light' ? 'Light' : 'Dark'));
    if (m) node.setExplicitVariableModeForCollection(c, m.modeId);
  }
}
function text(
  characters: string,
  size = 14,
  key = 'text.primary',
  mode: Theme = 'light',
  weight: 'regular' | 'medium' | 'bold' = 'regular',
  width?: number,
): TextNode {
  const node = figma.createText();
  node.name = 'Text';
  node.fontName = weight === 'bold' ? bold : weight === 'medium' ? medium : font;
  node.fontSize = size;
  node.lineHeight = { unit: 'PERCENT', value: size >= 32 ? 115 : 150 };
  node.characters = characters;
  node.textAutoResize = 'WIDTH_AND_HEIGHT';
  fills(node, key.startsWith('color.') ? key : themePath(key, mode));
  if (width) {
    node.textAutoResize = 'HEIGHT';
    node.resize(width, node.height);
  }
  const sizeToken = flattenTokens(document).find(
    (t) => t.path.startsWith('font.size.') && dimension(t.path) === size,
  );
  if (sizeToken && variables.get(sizeToken.path))
    node.setBoundVariable('fontSize', variables.get(sizeToken.path)!);
  return node;
}
function group(
  axis: 'HORIZONTAL' | 'VERTICAL' = 'VERTICAL',
  gap = 12,
  background?: string,
  mode: Theme = 'light',
): FrameNode {
  const node = figma.createFrame();
  node.name = 'Auto-layout';
  node.layoutMode = axis;
  node.primaryAxisSizingMode = 'AUTO';
  node.counterAxisSizingMode = 'AUTO';
  node.itemSpacing = gap;
  node.fills = [];
  if (background) fills(node, themePath(background, mode));
  return node;
}
function fixedWidth(node: FrameNode, width: number): void {
  node.resize(width, node.height);
  if (node.layoutMode === 'VERTICAL') node.counterAxisSizingMode = 'FIXED';
  else node.primaryAxisSizingMode = 'FIXED';
}
function pad(node: FrameNode, all: number): void {
  node.paddingTop = all;
  node.paddingBottom = all;
  node.paddingLeft = all;
  node.paddingRight = all;
}
function label(value: string, size = 14, key = 'text.primary', mode: Theme = 'light'): TextNode {
  const node = text(value, size, key, mode, 'medium');
  node.name = 'Label';
  return node;
}
function button(
  variant = 'Primary',
  size = 'Medium',
  state = 'Default',
  value = 'Get started',
  mode: Theme = 'light',
): FrameNode {
  const node = group(
    'HORIZONTAL',
    8,
    variant === 'Ghost'
      ? undefined
      : variant === 'Secondary'
        ? 'background.surface'
        : variant === 'Danger'
          ? 'status.danger'
          : 'action.primary',
    mode,
  );
  node.name = 'Button';
  node.primaryAxisAlignItems = 'CENTER';
  node.counterAxisAlignItems = 'CENTER';
  node.paddingLeft = size === 'Small' ? 12 : size === 'Large' ? 22 : 16;
  node.paddingRight = node.paddingLeft;
  node.paddingTop = size === 'Small' ? 7 : 10;
  node.paddingBottom = node.paddingTop;
  radius(node, 'component.button.radius');
  if (variant === 'Secondary') border(node, mode);
  if (state === 'Loading')
    node.appendChild(
      text(
        '◌',
        14,
        variant === 'Secondary' || variant === 'Ghost' ? 'text.primary' : 'action.onPrimary',
        mode,
      ),
    );
  const content = label(
    value,
    size === 'Small' ? 12 : 14,
    variant === 'Secondary' || variant === 'Ghost' ? 'text.primary' : 'action.onPrimary',
    mode,
  );
  node.appendChild(content);
  node.counterAxisSizingMode = 'FIXED';
  node.resize(node.width, size === 'Small' ? 32 : size === 'Large' ? 48 : 40);
  if (state === 'Disabled') node.opacity = 0.48;
  return node;
}
function field(state = 'Default', select = false, mode: Theme = 'light'): FrameNode {
  const node = group('VERTICAL', 7, undefined, mode);
  node.appendChild(label(select ? 'Your role' : 'Email address', 13, 'text.primary', mode));
  const box = group('HORIZONTAL', 8, 'background.surface', mode);
  pad(box, 11);
  fixedWidth(box, 260);
  box.primaryAxisAlignItems = 'SPACE_BETWEEN';
  radius(box, 'component.field.radius');
  border(box, mode);
  box.strokes = [paint(themePath('border.strong', mode))];
  if (state === 'Error') box.strokes = [paint(themePath('status.danger', mode))];
  box.appendChild(
    text(
      select ? 'Product designer' : state === 'Filled' ? 'hello@example.com' : 'hello@example.com',
      14,
      state === 'Filled' || select ? 'text.primary' : 'text.muted',
      mode,
    ),
  );
  if (select) box.appendChild(text('⌄', 16, 'text.secondary', mode));
  node.appendChild(box);
  node.appendChild(
    text(
      state === 'Error' ? 'Enter a valid email address.' : 'We will only send the good stuff.',
      12,
      state === 'Error' ? 'status.danger' : 'text.secondary',
      mode,
    ),
  );
  if (state === 'Disabled') node.opacity = 0.5;
  return node;
}
function checkControl(
  selected: boolean,
  switchControl = false,
  disabled = false,
  mode: Theme = 'light',
): FrameNode {
  const node = group('HORIZONTAL', 10, undefined, mode);
  node.counterAxisAlignItems = 'CENTER';
  if (switchControl) {
    const track = group('HORIZONTAL', 0, selected ? 'action.primary' : 'border.strong', mode);
    track.layoutMode = 'NONE';
    track.resize(36, 21);
    radius(track, 'radius.full');
    const dot = figma.createEllipse();
    dot.resize(15, 15);
    fills(dot, themePath(selected ? 'action.onPrimary' : 'background.surface', mode));
    track.appendChild(dot);
    dot.x = selected ? 18 : 3;
    dot.y = 3;
    node.appendChild(track);
  } else {
    const box = group('HORIZONTAL', 0, selected ? 'action.primary' : 'background.surface', mode);
    box.primaryAxisAlignItems = 'CENTER';
    box.counterAxisAlignItems = 'CENTER';
    box.resize(17, 17);
    box.primaryAxisSizingMode = 'FIXED';
    box.counterAxisSizingMode = 'FIXED';
    radius(box, 'radius.sm');
    if (!selected) {
      border(box, mode);
      box.strokes = [paint(themePath('border.strong', mode))];
    }
    if (selected) box.appendChild(text('✓', 12, 'action.onPrimary', mode, 'medium'));
    node.appendChild(box);
  }
  node.appendChild(
    label(switchControl ? 'Product updates' : 'Keep me in the loop', 13, 'text.primary', mode),
  );
  if (disabled) node.opacity = 0.5;
  return node;
}
function badge(tone = 'Success', value?: string, mode: Theme = 'light'): FrameNode {
  const key = tone.toLowerCase();
  const background =
    key === 'neutral' ? 'background.subtle' : key === 'accent' ? undefined : `status.${key}Subtle`;
  const foreground =
    key === 'neutral' ? 'text.secondary' : key === 'accent' ? 'color.forest.900' : `status.${key}`;
  const node = group('HORIZONTAL', 5, background, mode);
  if (key === 'accent') fills(node, 'color.lime.200');
  node.counterAxisAlignItems = 'CENTER';
  node.paddingLeft = 9;
  node.paddingRight = 9;
  node.paddingTop = 4;
  node.paddingBottom = 4;
  radius(node, 'radius.full');
  const dot = figma.createEllipse();
  dot.resize(5, 5);
  fills(dot, foreground.startsWith('color.') ? foreground : themePath(foreground, mode));
  node.appendChild(dot);
  node.appendChild(label(value || tone, 11, foreground, mode));
  return node;
}
function avatar(size = 'Medium', mode: Theme = 'light'): FrameNode {
  const dimensions = size === 'Small' ? 28 : size === 'Large' ? 54 : 38;
  const node = group('HORIZONTAL', 0, 'action.subtle', mode);
  node.primaryAxisAlignItems = 'CENTER';
  node.counterAxisAlignItems = 'CENTER';
  node.primaryAxisSizingMode = 'FIXED';
  node.counterAxisSizingMode = 'FIXED';
  node.resize(dimensions, dimensions);
  radius(node, 'radius.full');
  border(node, mode);
  node.appendChild(
    label('LM', size === 'Small' ? 10 : size === 'Large' ? 18 : 12, 'action.text', mode),
  );
  return node;
}
function progressBar(value = 65, mode: Theme = 'light'): FrameNode {
  const node = group('VERTICAL', 8, undefined, mode);
  const header = group('HORIZONTAL', 8, undefined, mode);
  fixedWidth(header, 260);
  header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  header.appendChild(label('Project progress', 12, 'text.secondary', mode));
  header.appendChild(text(`${value}%`, 12, 'text.secondary', mode));
  node.appendChild(header);
  const track = group('HORIZONTAL', 0, 'background.subtle', mode);
  track.layoutMode = 'NONE';
  track.resize(260, 6);
  radius(track, 'radius.full');
  const fill = figma.createRectangle();
  fill.resize(Math.max(1, (260 * value) / 100), 6);
  fills(fill, themePath('action.primary', mode));
  radius(fill, 'radius.full');
  track.appendChild(fill);
  fill.x = 0;
  fill.y = 0;
  node.appendChild(track);
  return node;
}
function card(footer = true, mode: Theme = 'light'): FrameNode {
  const node = group('VERTICAL', 14, 'background.surface', mode);
  pad(node, 20);
  fixedWidth(node, 300);
  radius(node, 'component.card.radius');
  border(node, mode);
  node.appendChild(text('THE NEXT CHAPTER', 10, 'action.text', mode, 'medium'));
  node.appendChild(label('A new perspective', 20, 'text.primary', mode));
  node.appendChild(
    text('Build something worth sharing.', 13, 'text.secondary', mode, 'regular', 260),
  );
  const row = group('HORIZONTAL', 10, undefined, mode);
  row.counterAxisAlignItems = 'CENTER';
  row.appendChild(avatar('Medium', mode));
  row.appendChild(text('Made with Forma', 13, 'text.primary', mode, 'medium'));
  node.appendChild(row);
  if (footer) node.appendChild(button('Primary', 'Small', 'Default', 'View project', mode));
  return node;
}

function draw(id: ComponentId, props: Record<string, string>, mode: Theme = 'light'): FrameNode {
  const state = props.State || 'Default';
  switch (id) {
    case 'button':
      return button(props.Variant, props.Size, state, 'Get started', mode);
    case 'text-field':
      return field(state, false, mode);
    case 'select':
      return field(state, true, mode);
    case 'checkbox':
      return checkControl(props.Checked === 'True', false, state === 'Disabled', mode);
    case 'switch':
      return checkControl(props.Checked === 'True', true, state === 'Disabled', mode);
    case 'radio-group': {
      const node = group('VERTICAL', 12, undefined, mode);
      node.appendChild(label('Preferred density', 13, 'text.primary', mode));
      for (const value of ['Comfortable', 'Compact']) {
        const row = group('HORIZONTAL', 10, undefined, mode);
        row.counterAxisAlignItems = 'CENTER';
        const circle = figma.createEllipse();
        circle.resize(17, 17);
        fills(circle, themePath('background.surface', mode));
        circle.strokes = [paint(themePath('action.primary', mode))];
        circle.strokeWeight = props.Value === value ? 5 : 1;
        row.appendChild(circle);
        row.appendChild(text(value, 13, 'text.primary', mode));
        node.appendChild(row);
      }
      if (state === 'Disabled') node.opacity = 0.5;
      return node;
    }
    case 'badge':
      return badge(props.Tone, undefined, mode);
    case 'avatar':
      return avatar(props.Size, mode);
    case 'card':
      return card(props.Footer === 'True', mode);
    case 'tabs': {
      const node = group('VERTICAL', 18, undefined, mode);
      const row = group('HORIZONTAL', 4, undefined, mode);
      for (const value of ['Overview', 'Details', 'Settings']) {
        const item = group('VERTICAL', 8, undefined, mode);
        item.paddingLeft = 12;
        item.paddingRight = 12;
        item.appendChild(
          label(value, 13, props.Active === value ? 'action.text' : 'text.secondary', mode),
        );
        if (props.Active === value) {
          const line = figma.createRectangle();
          line.resize(60, 2);
          fills(line, themePath('action.primary', mode));
          item.appendChild(line);
        }
        row.appendChild(item);
      }
      node.appendChild(row);
      node.appendChild(
        text(
          props.Active === 'Details' ? 'A little more context.' : 'Everything in its right place.',
          13,
          'text.secondary',
          mode,
        ),
      );
      return node;
    }
    case 'accordion': {
      const node = group('VERTICAL', 0, undefined, mode);
      const row = group('HORIZONTAL', 12, undefined, mode);
      fixedWidth(row, 300);
      row.primaryAxisAlignItems = 'SPACE_BETWEEN';
      row.paddingTop = 16;
      row.paddingBottom = 16;
      row.appendChild(label('What are design tokens?', 14, 'text.primary', mode));
      row.appendChild(text(state === 'Expanded' ? '⌃' : '⌄', 16, 'text.secondary', mode));
      node.appendChild(row);
      if (state === 'Expanded')
        node.appendChild(
          text('Named decisions, shared across tools.', 13, 'text.secondary', mode, 'regular', 290),
        );
      return node;
    }
    case 'dialog': {
      if (state === 'Closed') return button('Primary', 'Medium', 'Default', 'Open dialog', mode);
      const node = group('VERTICAL', 16, 'background.surface', mode);
      pad(node, 24);
      fixedWidth(node, 340);
      radius(node, 'radius.xl');
      border(node, mode);
      node.appendChild(label('A focused moment', 20, 'text.primary', mode));
      node.appendChild(text('Without losing your place.', 13, 'text.secondary', mode));
      node.appendChild(field('Default', false, mode));
      const row = group('HORIZONTAL', 8, undefined, mode);
      row.appendChild(button('Secondary', 'Small', 'Default', 'Not now', mode));
      row.appendChild(button('Primary', 'Small', 'Default', 'Sounds good', mode));
      node.appendChild(row);
      return node;
    }
    case 'alert': {
      const key = props.Tone.toLowerCase();
      const node = group('HORIZONTAL', 12, `status.${key}Subtle`, mode);
      pad(node, 16);
      fixedWidth(node, 310);
      radius(node);
      node.strokes = [paint(themePath(`status.${key}`, mode))];
      node.strokeWeight = 1;
      node.appendChild(text('ⓘ', 20, `status.${key}`, mode));
      const content = group('VERTICAL', 3, undefined, mode);
      content.appendChild(label('A useful detail', 13, `status.${key}`, mode));
      content.appendChild(
        text(
          'A helpful message, right when you need it.',
          12,
          `status.${key}`,
          mode,
          'regular',
          240,
        ),
      );
      node.appendChild(content);
      return node;
    }
    case 'progress':
      return progressBar(props.Value === 'Indeterminate' ? 35 : Number(props.Value), mode);
    case 'tooltip': {
      const node = group('VERTICAL', 10, undefined, mode);
      const bubble = group('HORIZONTAL', 0, 'background.inverted', mode);
      pad(bubble, 10);
      radius(bubble, 'radius.sm');
      bubble.appendChild(label('A useful detail', 12, 'text.inverse', mode));
      if (props.Position === 'Bottom') {
        node.appendChild(button('Secondary', 'Small', 'Default', 'Hover or focus me', mode));
        node.appendChild(bubble);
      } else {
        node.appendChild(bubble);
        node.appendChild(button('Secondary', 'Small', 'Default', 'Hover or focus me', mode));
      }
      return node;
    }
    case 'table': {
      const node = group('VERTICAL', 0, 'background.surface', mode);
      radius(node, 'radius.lg');
      border(node, mode);
      const header = group('HORIZONTAL', 36, 'background.canvas', mode);
      pad(header, 12);
      fixedWidth(header, 300);
      header.appendChild(label('Name', 12, 'text.secondary', mode));
      header.appendChild(label('Status', 12, 'text.secondary', mode));
      node.appendChild(header);
      if (state === 'Empty') {
        const row = group('HORIZONTAL', 0, undefined, mode);
        pad(row, 22);
        row.appendChild(text('No records yet.', 13, 'text.muted', mode));
        node.appendChild(row);
      } else {
        for (const name of ['Forma', 'Studio']) {
          const row = group('HORIZONTAL', 30, undefined, mode);
          pad(row, 12);
          fixedWidth(row, 300);
          row.appendChild(text(name, 13, 'text.primary', mode));
          row.appendChild(
            badge(
              name === 'Forma' ? 'Success' : 'Warning',
              name === 'Forma' ? 'Ready' : 'In progress',
              mode,
            ),
          );
          node.appendChild(row);
        }
      }
      return node;
    }
  }
}

function variants(id: ComponentId): Record<string, string>[] {
  switch (id) {
    case 'button':
      return ['Primary', 'Secondary', 'Ghost', 'Danger'].flatMap((Variant) =>
        ['Medium', 'Small', 'Large'].flatMap((Size) =>
          ['Default', 'Disabled', 'Loading'].map((State) => ({ Variant, Size, State })),
        ),
      );
    case 'text-field':
      return ['Default', 'Filled', 'Error', 'Disabled'].map((State) => ({ State }));
    case 'select':
      return ['Default', 'Error', 'Disabled'].map((State) => ({ State }));
    case 'checkbox':
    case 'switch':
      return [
        { Checked: 'False', State: 'Default' },
        { Checked: 'True', State: 'Default' },
        { Checked: 'True', State: 'Disabled' },
      ];
    case 'radio-group':
      return [
        { Value: 'Comfortable', State: 'Default' },
        { Value: 'Compact', State: 'Default' },
        { Value: 'Comfortable', State: 'Disabled' },
      ];
    case 'badge':
      return ['Neutral', 'Success', 'Warning', 'Danger', 'Info', 'Accent'].map((Tone) => ({
        Tone,
      }));
    case 'avatar':
      return ['Small', 'Medium', 'Large'].map((Size) => ({ Size }));
    case 'card':
      return [{ Footer: 'True' }, { Footer: 'False' }];
    case 'tabs':
      return ['Overview', 'Details', 'Settings'].map((Active) => ({ Active }));
    case 'accordion':
      return ['Collapsed', 'Expanded'].map((State) => ({ State }));
    case 'dialog':
      return ['Closed', 'Open'].map((State) => ({ State }));
    case 'alert':
      return ['Success', 'Warning', 'Danger', 'Info'].map((Tone) => ({ Tone }));
    case 'progress':
      return ['0', '65', '100', 'Indeterminate'].map((Value) => ({ Value }));
    case 'tooltip':
      return ['Top', 'Bottom'].map((Position) => ({ Position }));
    case 'table':
      return ['Populated', 'Empty'].map((State) => ({ State }));
  }
}

async function loadFonts(): Promise<void> {
  const available = await figma.listAvailableFontsAsync();
  const familyToken = resolveToken(document, 'font.family.sans');
  const desired = String(Array.isArray(familyToken) ? familyToken[0] : familyToken).replace(
    / Variable$/,
    '',
  );
  const family = available.some((f) => f.fontName.family === desired) ? desired : 'Inter';
  if (family !== desired)
    warnings.push(`${desired} is unavailable; Inter was used for native Figma text.`);
  const pick = (styles: string[]) =>
    styles
      .map((s) =>
        available.find(
          (f) => f.fontName.family === family && s.toLowerCase() === f.fontName.style.toLowerCase(),
        ),
      )
      .find(Boolean)?.fontName ?? { family, style: 'Regular' };
  font = pick(['Regular']);
  medium = pick(['Medium', 'Regular']);
  bold = pick(['SemiBold', 'Semi Bold', 'Bold', 'Medium', 'Regular']);
  await Promise.all([font, medium, bold].map((name) => figma.loadFontAsync(name)));
}

async function syncVariables(): Promise<void> {
  progress('Creating and updating native Forma variables…');
  const local = await figma.variables.getLocalVariableCollectionsAsync();
  const allVars = await figma.variables.getLocalVariablesAsync();
  const varsById = new Map(allVars.map((v) => [v.id, v]));
  collections = new Map();
  variables = new Map();
  bindings = {};
  const collection = (kind: string, name: string) => {
    let c = local.find(
      (c) => c.getPluginData('forma.owner') === OWNER && c.getPluginData('forma.kind') === kind,
    );
    if (!c) {
      c = figma.variables.createVariableCollection(name);
      c.setPluginData('forma.owner', OWNER);
      c.setPluginData('forma.kind', kind);
    }
    collections.set(kind, c);
    return c;
  };
  const primitives = collection('primitives', 'Forma · Primitives');
  const components = collection('components', 'Forma · Components');
  const semantics = collection('semantics', 'Forma · Semantics');
  semantics.renameMode(semantics.defaultModeId, 'Light');
  let darkMode = semantics.modes.find((m) => m.name === 'Dark')?.modeId;
  let darkCollection = semantics;
  if (!darkMode) {
    try {
      darkMode = semantics.addMode('Dark');
    } catch {
      darkCollection = collection('semantics-dark', 'Forma · Semantics (Dark)');
      darkCollection.renameMode(darkCollection.defaultModeId, 'Dark');
      darkMode = darkCollection.defaultModeId;
      warnings.push(
        'This file limits semantic modes. Light and Dark use separate native collections.',
      );
    }
  }
  for (const token of flattenTokens(document)) {
    const kind = token.path.startsWith('theme.')
      ? 'semantic'
      : token.path.startsWith('component.')
        ? 'component'
        : 'primitive';
    const isDark = token.path.startsWith('theme.dark.');
    const c =
      kind === 'semantic'
        ? isDark
          ? darkCollection
          : semantics
        : kind === 'component'
          ? components
          : primitives;
    const stem = token.path.replace(/^theme\.(light|dark)\./, '');
    const variableName = stem.replace(/\./g, '/');
    let v = c.variableIds.map((id) => varsById.get(id)).find((v) => v?.name === variableName);
    if (!v) {
      v = figma.variables.createVariable(variableName, c, figmaType(token));
      varsById.set(v.id, v);
    }
    if (v.resolvedType !== figmaType(token))
      throw new Error(
        `${token.path}: variable type changed. Use a new token name rather than changing a published variable's type.`,
      );
    v.description = `Forma ${token.type} · ${stem} · Created by ${OWNER}`;
    v.setPluginData('forma.owner', OWNER);
    v.setPluginData('forma.path', stem);
    variables.set(token.path, v);
    bindings[token.path] = {
      variableId: v.id,
      modeId:
        kind === 'semantic' ? (isDark ? darkMode! : semantics.defaultModeId) : c.defaultModeId,
    };
  }
  for (const token of flattenTokens(document)) {
    const binding = bindings[token.path];
    variables
      .get(token.path)!
      .setValueForMode(
        binding.modeId,
        encodeFigmaValue(document, token, bindings) as VariableValue,
      );
  }
  figma.root.setPluginData('forma.document', JSON.stringify(document));
  figma.root.setPluginData('forma.bindings', JSON.stringify(bindings));
}
async function syncTextStyles(): Promise<void> {
  const existing = await figma.getLocalTextStylesAsync();
  for (const [name, size, weight] of [
    ['Display', 56, 'medium'],
    ['Heading/01', 40, 'bold'],
    ['Heading/02', 32, 'medium'],
    ['Heading/03', 24, 'medium'],
    ['Body', 16, 'regular'],
    ['Interface', 14, 'medium'],
    ['Caption', 12, 'regular'],
  ] as const) {
    const full = `Forma/${name}`;
    const style = existing.find((s) => s.name === full) ?? figma.createTextStyle();
    style.name = full;
    style.description = `Created by ${OWNER}. Shared Forma type scale.`;
    style.fontName = weight === 'bold' ? bold : weight === 'medium' ? medium : font;
    style.fontSize = size;
    style.lineHeight = { unit: 'PERCENT', value: size >= 32 ? 115 : 150 };
  }
}
function page(name: string, suffix: string): PageNode {
  const node = figma.createPage();
  node.name = `${name}${suffix}`;
  node.setPluginData('forma.owner', OWNER);
  node.backgrounds = [{ type: 'SOLID', color: { r: 0.95, g: 0.96, b: 0.94 } }];
  return node;
}

/**
 * Reserve the four pages before anything is generated.
 *
 * Figma Starter files hold three pages and `figma.createPage()` throws once the limit is
 * reached. `Auto` keeps the pages that Figma did create (for example `00` and `01`) and shares
 * every board across them; `Four new pages only` rolls its reservation back. Nothing is deleted.
 */
async function reserveFormaPages(
  suffix: string,
  strict: boolean,
): Promise<{ pages: PageNode[]; available: number; detail?: string }> {
  progress('Reserving the Forma pages…');
  return reservePages<PageNode>(
    {
      current: () => figma.currentPage,
      create: (name) => page(name, suffix),
      remove: (node) => node.remove(),
      setCurrentPage: (node) => figma.setCurrentPageAsync(node),
    },
    FORMA_PAGE_NAMES,
    (node) => warnings.push(`${node.name} could not be removed after the page limit was reached.`),
    !strict,
  );
}

/**
 * Existing Forma pages by their base name (any generation suffix), newest last. Used when Figma
 * refuses new pages, so a re-run places its boards on the Forma pages that already exist.
 */
function findFormaPages(): (PageNode | undefined)[] {
  return FORMA_PAGE_NAMES.map((base) => {
    const matches = figma.root.children.filter(
      (node): node is PageNode =>
        node.type === 'PAGE' && (node.name === base || node.name.startsWith(`${base} · `)),
    );
    return matches[matches.length - 1];
  });
}

/** The first free vertical position on a page, below everything already placed there. */
function nextY(node: PageNode): number {
  const boxes = node.children.filter(
    (child): child is SceneNode & { y: number; height: number } =>
      'y' in child && 'height' in child,
  );
  return boxes.length ? Math.max(...boxes.map((box) => box.y + box.height)) + 240 : 0;
}

/** Space to the right of anything already on the page, so a one-page build never overlaps it. */
function freeSpace(node: PageNode): { x: number; y: number } {
  const boxes = node.children.filter(
    (child): child is SceneNode & { x: number; y: number; width: number } =>
      'x' in child && 'y' in child && 'width' in child,
  );
  if (!boxes.length) return { x: 0, y: 0 };
  return {
    x: Math.max(...boxes.map((box) => box.x + box.width)) + 240,
    y: Math.min(...boxes.map((box) => box.y)),
  };
}

/**
 * Places the four boards on the pages they were assigned to. A page holding one board is left as
 * is. A page shared by several boards stacks them in order, each under its own heading, so every
 * component set remains reachable. Boards already on a reused page are kept; new ones go below.
 */
function arrangeBoards(
  assignments: readonly { board: FrameNode; host: PageNode }[],
  home: PageNode,
  origin: { x: number; y: number },
  shared: boolean,
): void {
  const hosts = [...new Set(assignments.map((item) => item.host))];
  for (const host of hosts) {
    const onHost = assignments.filter((item) => item.host === host);
    const startsAtHome = host === home;
    let y = startsAtHome ? origin.y : nextY(host);
    const x = startsAtHome ? origin.x : 0;
    if (shared) {
      const caption = text(SINGLE_PAGE_CAPTION, 14, 'text.secondary', 'light', 'regular', 900);
      host.appendChild(caption);
      caption.x = x;
      caption.y = y;
      y += caption.height + 60;
    }
    for (const { board: frame } of onHost) {
      if (shared) {
        // A heading names each board on a shared page; the boards keep their own titles.
        const heading = text(frame.name, 24, 'text.primary', 'light', 'medium');
        host.appendChild(heading);
        heading.x = x;
        heading.y = y;
        y += heading.height + 18;
      }
      host.appendChild(frame);
      frame.x = x;
      frame.y = y;
      y += frame.height + 180;
    }
  }
}

function board(
  parent: PageNode,
  name: string,
  width = 1280,
  mode: Theme = 'light',
  credit = true,
): FrameNode {
  const node = group('VERTICAL', 30, 'background.canvas', mode);
  node.name = name;
  applyMode(node, mode);
  pad(node, 48);
  fixedWidth(node, width);
  parent.appendChild(node);
  if (credit) node.appendChild(text(`Created by ${OWNER}`, 12, 'text.secondary', mode));
  node.x = 0;
  node.y = 0;
  return node;
}
function title(parent: FrameNode, value: string, description?: string): void {
  parent.appendChild(text(value, 32, 'text.primary', 'light', 'medium'));
  if (description)
    parent.appendChild(text(description, 14, 'text.secondary', 'light', 'regular', 1100));
}
async function buildPages(
  storybookBase: string,
  preference: PlacementPreference,
): Promise<{ kind: PlacementKind; pageNames: string[] }> {
  const sequence = Number(figma.root.getPluginData('forma.generation') || '0') + 1;
  const suffix = sequence > 1 ? ` · ${sequence}` : '';
  const home = figma.currentPage;
  const origin = freeSpace(home);
  const reservation =
    preference === 'single'
      ? { pages: [] as PageNode[], available: 0 }
      : await reserveFormaPages(suffix, preference === 'pages');
  // Forma pages usable for boards: the ones just created, plus existing ones with the same names.
  const existing = preference === 'single' ? [] : findFormaPages();
  const slots: (PageNode | undefined)[] = FORMA_PAGE_NAMES.map(
    (_, index) => reservation.pages[index] ?? existing[index],
  );
  const usable = slots.filter((node): node is PageNode => !!node);
  const kind = resolvePlacement(preference, reservation.available, usable.length);
  if (kind !== 'pages' && preference !== 'single')
    warnings.push(
      placementNotice({
        available: reservation.available,
        pageNames: usable.map((node) => node.name),
        detail: reservation.detail,
      }),
    );
  const targets: PageNode[] = kind === 'single' ? [home] : usable;
  const pageNames = targets.map((node) => node.name);
  const hostFor = assignBoards(FORMA_BOARD_NAMES.length, targets.length).map((i) => targets[i]!);
  const focus = async (target: PageNode): Promise<void> => {
    if (target !== figma.currentPage) await figma.setCurrentPageAsync(target);
  };
  const cover = hostFor[0]!;
  const foundations = hostFor[1]!;
  const components = hostFor[2]!;
  const patterns = hostFor[3]!;
  await focus(cover);
  const coverBoard = board(cover, 'Forma · Cover', 1280, 'light', false);
  coverBoard.layoutMode = 'NONE';
  coverBoard.resize(1280, 720);
  const eyebrow = text(
    'DESIGN WITH INTENTION. BUILD WITH CONFIDENCE.',
    12,
    'action.text',
    'light',
    'medium',
  );
  coverBoard.appendChild(eyebrow);
  eyebrow.x = 64;
  eyebrow.y = 72;
  for (const [value, y] of [
    ['One system.', 142],
    ['Infinite possibilities.', 212],
  ] as const) {
    const heading = text(value, 56, 'text.primary', 'light', 'medium');
    coverBoard.appendChild(heading);
    heading.x = 64;
    heading.y = y;
  }
  const description = text(
    'A shared language for thoughtful products.\nFigma → Tokens → React / Angular → Storybook',
    18,
    'text.secondary',
  );
  coverBoard.appendChild(description);
  description.x = 64;
  description.y = 328;
  const creator = text(`Designed & created by ${OWNER}`, 16, 'action.text', 'light', 'medium');
  coverBoard.appendChild(creator);
  creator.x = 64;
  creator.y = 570;
  const version = text(
    `Forma v1.0.0 · ${flattenTokens(document).length} token values · 16 core components`,
    12,
    'text.secondary',
  );
  coverBoard.appendChild(version);
  version.x = 64;
  version.y = 616;
  for (let i = 0; i < 4; i++) {
    const tile = figma.createRectangle();
    tile.resize(142, 142);
    fills(tile, i === 1 || i === 2 ? 'color.forest.700' : 'color.lime.300');
    radius(tile, 'radius.xl');
    coverBoard.appendChild(tile);
    tile.x = 876 + (i % 2) * 150;
    tile.y = 142 + Math.floor(i / 2) * 150;
    const shape = figma.createEllipse();
    shape.resize(95, 95);
    fills(shape, i % 2 ? 'color.forest.100' : 'color.forest.700');
    coverBoard.appendChild(shape);
    shape.x = tile.x + 23;
    shape.y = tile.y + 23;
  }
  await focus(foundations);
  const foundationBoard = board(foundations, 'Forma · Foundations');
  title(
    foundationBoard,
    'Start with the essentials',
    'Primitive values create the range. Semantic aliases provide purpose. Change Light / Dark in the variable mode picker.',
  );
  for (const family of ['forest', 'neutral', 'lime', 'blue', 'amber', 'red']) {
    const section = group('VERTICAL', 12);
    section.appendChild(
      text(family[0].toUpperCase() + family.slice(1), 20, 'text.primary', 'light', 'medium'),
    );
    const row = group('HORIZONTAL', 9);
    for (const token of flattenTokens(document).filter((t) =>
      t.path.startsWith(`color.${family}.`),
    )) {
      const swatch = group('VERTICAL', 8);
      const block = figma.createRectangle();
      block.resize(88, 70);
      fills(block, token.path);
      radius(block, 'radius.sm');
      swatch.appendChild(block);
      swatch.appendChild(text(token.path.split('.').slice(-1)[0], 12, 'text.secondary'));
      row.appendChild(swatch);
    }
    section.appendChild(row);
    foundationBoard.appendChild(section);
  }
  foundationBoard.appendChild(text('A little character', 32, 'text.primary', 'light', 'medium'));
  for (const token of flattenTokens(document)
    .filter((t) => t.path.startsWith('font.size.'))
    .reverse()) {
    const row = group('HORIZONTAL', 25);
    row.counterAxisAlignItems = 'CENTER';
    row.appendChild(text(`${token.path} / ${dimension(token.path)}px`, 12, 'text.secondary'));
    row.appendChild(text('Good design. A shared language.', dimension(token.path)));
    foundationBoard.appendChild(row);
  }
  foundationBoard.appendChild(text('Room to breathe', 32, 'text.primary', 'light', 'medium'));
  const spaces = group('HORIZONTAL', 20);
  for (const token of flattenTokens(document).filter((t) => t.path.startsWith('space.'))) {
    const column = group('VERTICAL', 9);
    const shape = figma.createRectangle();
    shape.resize(Math.max(1, dimension(token.path)), 40);
    fills(shape, 'color.forest.200');
    radius(shape, 'radius.sm');
    column.appendChild(shape);
    column.appendChild(text(`${dimension(token.path)}px`, 12, 'text.secondary'));
    spaces.appendChild(column);
  }
  foundationBoard.appendChild(spaces);
  const radii = group('HORIZONTAL', 25);
  for (const token of flattenTokens(document).filter((t) => t.path.startsWith('radius.'))) {
    const column = group('VERTICAL', 10);
    const shape = figma.createRectangle();
    shape.resize(70, 70);
    fills(shape, 'color.forest.100');
    radius(shape, token.path);
    column.appendChild(shape);
    column.appendChild(text(token.path, 12, 'text.secondary'));
    radii.appendChild(column);
  }
  foundationBoard.appendChild(radii);
  await focus(components);
  const componentBoard = board(components, 'Forma · Component library', 1390);
  title(
    componentBoard,
    'Made to work together',
    'Visual variants, auto layout, and native token bindings. Prototype interactions are intentionally left for the designer to wire.',
  );
  const sets = new Map<ComponentId, ComponentSetNode>();
  for (const id of ids) {
    progress(`Building ${names[id]} visual variants…`);
    componentBoard.appendChild(text(names[id], 24, 'text.primary', 'light', 'medium'));
    const specs = variants(id);
    const nodes: ComponentNode[] = [];
    const cols = id === 'button' ? 6 : 3;
    const cellWidth = id === 'button' ? 196 : 415;
    const rowHeight =
      id === 'dialog'
        ? 350
        : id === 'card'
          ? 260
          : id === 'text-field' || id === 'select'
            ? 150
            : id === 'table'
              ? 200
              : 130;
    specs.forEach((spec, index) => {
      const drawn = draw(id, spec);
      const c = figma.createComponent();
      c.name = Object.entries(spec)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');
      c.layoutMode = 'VERTICAL';
      c.primaryAxisSizingMode = 'AUTO';
      c.counterAxisSizingMode = 'AUTO';
      c.fills = [];
      c.appendChild(drawn);
      components.appendChild(c);
      c.x = 24 + (index % cols) * cellWidth;
      c.y = 24 + Math.floor(index / cols) * rowHeight;
      c.description = `Forma ${names[id]} · Created by ${OWNER}. ${codeRef(id)}`;
      nodes.push(c);
    });
    const set = figma.combineAsVariants(nodes, components);
    set.name = names[id];
    set.fills = [paint(themePath('background.surface'))];
    set.strokes = [paint(themePath('border.default'))];
    set.strokeWeight = 1;
    radius(set, 'radius.lg');
    set.resize(cols * cellWidth + 24, Math.ceil(specs.length / cols) * rowHeight + 24);
    set.setPluginData('forma.component', id);
    set.setPluginData('forma.reactExport', exports[id]);
    set.setPluginData('forma.angularSelector', angularSelector(id));
    const storyPath = `/docs/${storySlugs[id]}--docs`;
    const url = storybookBase ? `${storybookBase.replace(/\/$/, '')}/?path=${storyPath}` : '';
    const storyRef = url || `Storybook: ${storyPath}`;
    set.description = `Created by ${OWNER}. ${codeRef(id)}. ${storyRef}`;
    const labelNodes = nodes
      .map((c) => c.findOne((n) => n.type === 'TEXT' && n.name === 'Label') as TextNode | null)
      .filter((n): n is TextNode => !!n);
    if (
      labelNodes.length &&
      !['badge', 'tabs', 'table', 'progress', 'radio-group', 'dialog', 'tooltip'].includes(id)
    ) {
      const key = set.addComponentProperty('Label', 'TEXT', labelNodes[0].characters);
      for (const node of labelNodes) node.componentPropertyReferences = { characters: key };
    }
    componentBoard.appendChild(set);
    sets.set(id, set);
  }
  await focus(patterns);
  const patternBoard = board(patterns, 'Forma · Composed patterns', 1280);
  title(
    patternBoard,
    'Compose, don’t recreate',
    'Instances reference the generated component sets. Compare the Light and Dark native variable modes.',
  );
  const patternRow = group('HORIZONTAL', 40);
  for (const mode of ['light', 'dark'] as const) {
    const panel = group('VERTICAL', 20, 'background.surface', mode);
    applyMode(panel, mode);
    pad(panel, 28);
    fixedWidth(panel, 490);
    radius(panel, 'radius.xl');
    border(panel, mode);
    panel.appendChild(text(`Make yourself at home · ${mode}`, 24, 'text.primary', mode, 'medium'));
    panel.appendChild(text('A little structure for your next idea.', 14, 'text.secondary', mode));
    for (const id of [
      'avatar',
      'text-field',
      'select',
      'switch',
      'checkbox',
      'button',
    ] as ComponentId[]) {
      const instance = sets.get(id)!.defaultVariant.createInstance();
      panel.appendChild(instance);
      if (mode === 'dark') rebindSemanticPaints(instance, 'dark');
    }
    panel.appendChild(text(`Created by ${OWNER}`, 12, 'text.secondary', mode));
    patternRow.appendChild(panel);
  }
  patternBoard.appendChild(patternRow);
  figma.root.setPluginData('forma.generation', String(sequence));
  arrangeBoards(
    [coverBoard, foundationBoard, componentBoard, patternBoard].map((frame, index) => ({
      board: frame,
      host: hostFor[index]!,
    })),
    home,
    origin,
    kind !== 'pages',
  );
  await focus(cover);
  figma.currentPage.selection = [coverBoard];
  figma.viewport.scrollAndZoomIntoView([coverBoard]);
  return { kind, pageNames };
}

// Instances inherit their ancestor's native mode. No child locks a default Light mode.
// When the file only allows one mode, override instance paints with the corresponding
// variable from the separate collection, retaining instances and alias bindings.
function rebindSemanticPaints(node: SceneNode, mode: Theme): void {
  const replacements = new Map<string, Variable>();
  for (const token of flattenTokens(document).filter((t) => t.path.startsWith('theme.light.'))) {
    const light = variables.get(token.path);
    const target = variables.get(token.path.replace('theme.light.', `theme.${mode}.`));
    if (light && target && light.id !== target.id) replacements.set(light.id, target);
  }
  if (!replacements.size) return;
  const visit = (node: SceneNode): void => {
    const convert = (paints: readonly Paint[]): Paint[] =>
      paints.map((p) => {
        if (p.type !== 'SOLID') return p;
        const id = p.boundVariables?.color?.id;
        const variable = id ? replacements.get(id) : undefined;
        return variable ? figma.variables.setBoundVariableForPaint(p, 'color', variable) : p;
      });
    if ('fills' in node && Array.isArray(node.fills))
      node.fills = convert(node.fills as readonly Paint[]);
    if ('strokes' in node && Array.isArray(node.strokes))
      node.strokes = convert(node.strokes as readonly Paint[]);
    if ('children' in node) for (const child of node.children) visit(child);
  };
  visit(node);
}

async function exportVariables(): Promise<TokenDocument> {
  const saved = figma.root.getPluginData('forma.document');
  const mapping = figma.root.getPluginData('forma.bindings');
  if (!saved || !mapping)
    throw new Error(
      'Build the Forma library in this file first. There is no variable mapping to export yet.',
    );
  const source = JSON.parse(saved) as TokenDocument;
  const map = JSON.parse(mapping) as VariableMap;
  const output = jsonClone(source);
  const local = await figma.variables.getLocalVariablesAsync();
  const byId = new Map(local.map((v) => [v.id, v]));
  for (const token of flattenTokens(source)) {
    const binding = map[token.path];
    if (!binding) throw new Error(`Missing mapping: ${token.path}`);
    const variable = byId.get(binding.variableId);
    if (!variable)
      throw new Error(
        `The variable for ${token.path} was deleted. Rebuild the library before exporting.`,
      );
    const value = variable.valuesByMode[binding.modeId];
    if (value === undefined) throw new Error(`Missing mode value for ${token.path}.`);
    let target = output as Record<string, unknown>;
    for (const key of token.path.split('.')) target = target[key] as Record<string, unknown>;
    const original = resolveToken(source, token.path);
    target.$value = decodeFigmaValue(token, value as PortableFigmaValue, map, original);
  }
  assertTokens(output);
  return output;
}

figma.showUI(__html__, { width: 420, height: 720, themeColors: true });
figma.ui.onmessage = async (message: {
  type: string;
  tokens?: unknown;
  storybookBase?: string;
  placement?: unknown;
}) => {
  if (message.type === 'ready') {
    let stored: TokenDocument | undefined;
    try {
      const value = figma.root.getPluginData('forma.document');
      if (value) stored = JSON.parse(value);
    } catch {}
    figma.ui.postMessage({ type: 'source', bundled: defaultTokens, tokens: stored });
    return;
  }
  if (busy) return;
  busy = true;
  try {
    if (message.type === 'build') {
      assertTokens(message.tokens);
      document = message.tokens;
      warnings = [];
      await loadFonts();
      await syncVariables();
      await syncTextStyles();
      const placement = isPlacementPreference(message.placement) ? message.placement : 'auto';
      const { kind, pageNames } = await buildPages(message.storybookBase || '', placement);
      const count = new Set(Object.values(bindings).map((b) => b.variableId)).size;
      const summary = `Built ${count} native variables, ${flattenTokens(document).length} mode values, 16 component sets, and ${placementSummary(kind, pageNames)}.\nCreated by ${OWNER}.${warnings.length ? '\n\n' + warnings.join('\n') : ''}`;
      figma.ui.postMessage({ type: 'success', message: summary });
      figma.notify('Forma design library created.');
    } else if (message.type === 'export') {
      const tokens = await exportVariables();
      figma.ui.postMessage({ type: 'export', tokens });
    }
  } catch (error) {
    const message = (error as Error).message;
    figma.ui.postMessage({
      type: 'error',
      message: `The operation could not finish: ${message}\nNo existing pages were deleted. Review the file before retrying.`,
    });
    figma.notify(message, { error: true });
  } finally {
    busy = false;
  }
};
