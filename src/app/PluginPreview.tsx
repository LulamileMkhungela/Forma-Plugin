/**
 * The real Forma plugin panel, embedded — not a screenshot, so the guide can never show a
 * UI that drifted away from the plugin. `npm run build:figma` publishes
 * `figma-plugin/ui.html` (and its bundled tokens) to `public/plugin/` for this frame.
 *
 * Outside Figma the panel detects that it cannot reach a sandbox: it loads its own token
 * copy, counts them for real, and explains what each button would do in Figma.
 */
export function PluginPreview({ caption, className = '' }: { caption?: string; className?: string }) {
  return (
    <figure className={`plugin-preview${className ? ` ${className}` : ''}`}>
      <div className="plugin-preview__chrome">
        <span className="plugin-preview__lights" aria-hidden="true"><i /><i /><i /></span>
        <b>Forma · plugin panel</b>
        <small>live</small>
      </div>
      <iframe title="Forma Figma plugin panel, live preview" src="/plugin/ui.html" loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
