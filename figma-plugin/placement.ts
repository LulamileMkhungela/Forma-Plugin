/**
 * Forma page placement.
 *
 * Created by Lulamile Mkhungela.
 *
 * Figma limits how many pages a file may hold — Starter teams are limited to
 * three Figma Design pages — and `figma.createPage()` throws once the limit is
 * reached. Where the four Forma boards are built is therefore a decision, not a
 * constant. It is kept here, away from the Figma API, so it can be unit-tested
 * without a real design file.
 *
 * Nothing is ever deleted. When Figma allows fewer than four new pages, the pages
 * that do exist are used, and every board is still built and placed on them.
 */
export const FORMA_PAGE_COUNT = 4;
export const FORMA_PAGE_NAMES = [
  '00 · Forma — Start here',
  '01 · Foundations',
  '02 · Components',
  '03 · Patterns',
] as const;
/** The four page-level boards, in order. They share a heading when they share a page. */
export const FORMA_BOARD_NAMES = [
  '00 · Forma — Start here',
  '01 · Foundations',
  '02 · Components',
  '03 · Patterns',
] as const;

export type PlacementPreference = 'auto' | 'single' | 'pages';
/**
 * - `pages`: four separate Forma pages, one board each.
 * - `shared`: fewer pages than four were available; every board is spread across the
 *   Forma pages that exist, in order, with headings. Nothing is left out.
 * - `single`: the page the user already had open holds every board.
 */
export type PlacementKind = 'pages' | 'shared' | 'single';

export function isPlacementPreference(value: unknown): value is PlacementPreference {
  return value === 'auto' || value === 'single' || value === 'pages';
}

/**
 * `available` is how many new pages this run could actually create (0–4), measured by
 * the plugin before anything is generated. `filled` is how many Forma pages can host
 * boards in total (new pages plus existing Forma pages reused by name).
 *
 * - `single` never asks for pages, so it always suits a plan-limited file.
 * - `auto` uses four pages when the file allows them. Otherwise it shares every board
 *   across the Forma pages that exist; only with none available does it use the open page.
 * - `pages` is strict: it refuses rather than quietly building somewhere else.
 */
export function resolvePlacement(
  preference: PlacementPreference,
  available: number,
  filled: number = available,
): PlacementKind {
  if (preference === 'single') return 'single';
  if (available >= FORMA_PAGE_COUNT) return 'pages';
  if (preference === 'pages')
    throw new Error(
      `Figma allowed ${available} of the ${FORMA_PAGE_COUNT} new pages Forma needs (Starter files are limited to three pages). Nothing was deleted. Choose “Auto” or “This page” in Where to build, or free up pages and build again.`,
    );
  return filled >= 1 ? 'shared' : 'single';
}

/**
 * Which host each board goes to. `hosts` lists the pages that can take boards, in order;
 * boards are dealt round-robin so every page receives content and each page keeps its own
 * order. Four pages give one board per page; two pages give 00 + 02 and 01 + 03.
 */
export function assignBoards(boardCount: number, hosts: number): number[] {
  const count = Math.max(1, hosts);
  return Array.from({ length: boardCount }, (_, index) => index % count);
}

/**
 * The only Figma page calls reservation needs, injected so it can be unit-tested
 * without a design file.
 */
export interface PagePort<Node> {
  current(): Node;
  create(name: string): Node;
  remove(node: Node): void;
  setCurrentPage(page: Node): Promise<void>;
}

export type Reservation<Node> = {
  pages: Node[];
  available: number;
  detail?: string;
};

/**
 * Create every requested page, or — when `keepPartial` is set — as many as Figma allows.
 *
 * With `keepPartial` false (strict `Four new pages only`), a refused reservation is rolled
 * back: only pages created by this call are removed, after returning to the page that was
 * current. With `keepPartial` true (`Auto`), the pages that were created are kept and used,
 * because deleting them would only force the boards onto one crowded page.
 */
export async function reservePages<Node>(
  port: PagePort<Node>,
  names: readonly string[],
  onRemoveFailure?: (node: Node) => void,
  keepPartial = false,
): Promise<Reservation<Node>> {
  const home = port.current();
  const created: Node[] = [];
  try {
    for (const name of names) created.push(port.create(name));
    return { pages: created, available: created.length };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    if (keepPartial) return { pages: created, available: created.length, detail };
    if (created.length) {
      // createPage() can move the current page: never remove a page that is still current.
      await port.setCurrentPage(home);
      for (const node of created) {
        try {
          port.remove(node);
        } catch {
          onRemoveFailure?.(node);
        }
      }
    }
    return { pages: [], available: created.length, detail };
  }
}

/** Used in the completion summary so the report matches what the file contains. */
export function placementSummary(kind: PlacementKind, pageNames: readonly string[] = []): string {
  if (kind === 'pages') return `${FORMA_PAGE_COUNT} new pages`;
  if (kind === 'single') return `${FORMA_PAGE_COUNT} labelled boards on the page you had open`;
  return `${FORMA_PAGE_COUNT} boards shared across ${pageNames.length} Forma page${
    pageNames.length === 1 ? '' : 's'
  } (${pageNames.join(', ')})`;
}

/** The notice added to the summary when the boards had to be shared. */
export function placementNotice(input: {
  available: number;
  pageNames?: readonly string[];
  detail?: string;
}): string {
  const allowed = input.available === 1 ? 'one new page' : `${input.available} new pages`;
  const where = input.pageNames?.length
    ? `The boards were placed on ${input.pageNames.join(', ')}, in order, under headings.`
    : 'The boards were placed on the page you had open, in order, under headings.';
  return [
    `Figma allowed ${allowed} in this file, so every Forma board is shown on the Forma pages available. ${where} Nothing was deleted.`,
    'Upgrade the Figma plan or use a file with room for four pages to get four separate pages.',
    input.detail ? `Figma reported: ${input.detail}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/** The caption drawn above a shared page's first board. */
export const SINGLE_PAGE_CAPTION =
  'Shared Forma page. Every board is included here in order. Nothing was deleted.';
