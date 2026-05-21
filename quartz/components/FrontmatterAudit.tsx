// quartz/components/FrontmatterAudit.tsx
import vaultAudit from "../../quartz/static/data/frontmatter-audit.json"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

interface AuditData {
  generated: string
  properties: Record<string, { label: string; description: string }>
  vault: Record<string, number>
}

const data = vaultAudit as AuditData

const processed = Object.entries(data.vault || {}).map(([name, val]) => {
  const meta = data.properties?.[name]
  return {
    label: meta?.label || name,
    desc: meta?.description || "",
    pct: Math.max(0, Math.min(100, Math.round(Number(val) || 0)))
  }
}).sort((a, b) => b.pct - a.pct)

const vaultPct = processed.length ? Math.round(processed.reduce((s, p) => s + p.pct, 0) / processed.length) : 0
const getColor = (p: number) => p >= 90 ? "var(--secondary)" : p >= 50 ? "var(--tertiary)" : "var(--gray)"

const formatTime = (dStr: string) => {
  if (!dStr) return ""
  const secs = Math.floor((Date.now() - new Date(dStr).getTime()) / 1000)
  if (secs < 30) return "just now"
  const units = [{ l: 'y', s: 31536000 }, { l: 'mo', s: 2592000 }, { l: 'd', s: 864000 }, { l: 'h', s: 3600 }, { l: 'm', s: 60 }]
  for (const u of units) {
    const c = Math.floor(secs / u.s)
    if (c >= 1) return `${c}${u.l} ago`
  }
  return "recently"
}

const FrontmatterAudit: QuartzComponent = () => (
  <>
    <style>{`
      .aud-container { margin: 2rem 0; font-family: var(--bodyFont); }
      
      /* Hero Row with Accent Pill Badge */
      .aud-hero { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; }
      .aud-pill-badge { font-size: 1.15rem; font-weight: 700; padding: 0.4rem 1rem; border-radius: 4px; background: var(--highlight); color: var(--secondary); letter-spacing: -0.01em; font-family: var(--codeFont);}
      .aud-timestamp { font-size: 0.75rem; color: var(--gray); font-family: var(--codeFont); letter-spacing: 0.05em; }
      
      /* Borderless Grid Layout */
      .aud-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 2rem 3rem; }
      .aud-item { display: flex; flex-direction: column; gap: 0.35rem; }
      
      .aud-meta { display: flex; justify-content: space-between; align-items: flex-end; }
      .aud-label { color: var(--darkgray); font-weight: 700; font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .aud-value { font-weight: 600; font-size: 0.85rem; font-family: var(--codeFont); }
      
      /* Ultra-thin Hairline Track */
      .aud-bar-bg { height: 4px; background: var(--lightgray); width: 100%; border-radius: 4px;}
      .aud-bar-fill { height: 100%; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 4px;}
      .aud-desc { font-size: 0.75rem; color: var(--gray); margin: 0; line-height: 1.4; padding-top: 0.1rem; }
    `}</style>
    
    <div className="aud-container">
      <div className="aud-hero">
        <div className="aud-pill-badge">
          {vaultPct}% Complete
        </div>
        {data.generated && <span className="aud-timestamp">Analyzed {formatTime(data.generated)}</span>}
      </div>

      <div className="aud-grid">
        {processed.map(({ label, desc, pct }) => {
          const color = getColor(pct)
          return (
            <div className="aud-item" key={label}>
              <div className="aud-meta">
                <span className="aud-label" title={label}>{label}</span>
                <span className="aud-value" style={{ color }}>{pct}%</span>
              </div>
              <div className="aud-bar-bg">
                <div className="aud-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
              {desc && <p className="aud-desc">{desc}</p>}
            </div>
          )
        })}
      </div>
    </div>
  </>
)

export default (() => FrontmatterAudit) satisfies QuartzComponentConstructor