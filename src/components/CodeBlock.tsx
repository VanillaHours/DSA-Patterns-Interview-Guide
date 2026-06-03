import './CodeBlock.css'

export function CodeBlock({ code, caption }: { code: string; caption?: string }) {
  return (
    <div className="code-wrap">
      {caption && <p className="code-caption">{caption}</p>}
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
