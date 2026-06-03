import { useState } from 'react'
import type { XRayFragment, XRayKind } from '../../types/leafEnhancement'
import './PromptXRay.css'

const KIND_LABEL: Record<XRayKind, string> = {
  signal: 'SIGNAL',
  constraint: 'CONSTRAINT',
  output: 'OUTPUT',
  goal: 'GOAL',
}

function renderHighlighted(text: string, xrayOn: boolean) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className={xrayOn ? 'xray-glow' : ''}>
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function PromptXRay({ fragments }: { fragments: XRayFragment[] }) {
  const [xrayOn, setXrayOn] = useState(true)

  return (
    <div className="prompt-xray">
      <div className="xray-head">
        <span className="xray-label">① Prompt X-Ray</span>
        <button
          type="button"
          className={`xray-toggle ${xrayOn ? 'on' : ''}`}
          onClick={() => setXrayOn(!xrayOn)}
        >
          {xrayOn ? 'X-Ray on' : 'X-Ray off'}
        </button>
      </div>
      <ul className={`xray-list ${xrayOn ? 'active' : ''}`}>
        {fragments.map((f, i) => (
          <li key={i} className={`xray-item kind-${f.kind}`}>
            <span className="xray-kind">{KIND_LABEL[f.kind]}</span>
            <span className="xray-text">{renderHighlighted(f.text, xrayOn)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
