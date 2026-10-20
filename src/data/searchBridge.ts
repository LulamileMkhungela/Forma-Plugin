/**
 * One-shot bridge from global search to the token explorer.
 * Search results can request a token selection even when the
 * Tokens page is not mounted yet; the request is consumed on mount.
 */
type TokenSelectionListener = (tokenName: string) => void;

const listeners = new Set<TokenSelectionListener>();
let pendingTokenName: string | null = null;

export function requestTokenSelection(tokenName: string): void {
  pendingTokenName = tokenName;
  listeners.forEach((listener) => listener(tokenName));
}

export function consumePendingTokenSelection(): string | null {
  const name = pendingTokenName;
  pendingTokenName = null;
  return name;
}

export function onTokenSelection(listener: TokenSelectionListener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
