import React from 'react'

export default function ResultsList({ results = [] }) {
  if (!results || results.length === 0) {
    return <div className="results-empty">No results</div>
  }

  return (
    <ul className="results-list">
      {results.map((r, i) => {
        const title = r.title || r.name || `Result ${i + 1}`
        const snippet = r.snippet || r.excerpt || r.description || ''
        const url = r.url || r.link || r.href
        return (
          <li key={i} className="result-item">
            <div className="result-title">
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {title}
                </a>
              ) : (
                <span>{title}</span>
              )}
            </div>
            {snippet && <div className="result-snippet">{snippet}</div>}
            {url && <div className="result-url">{url}</div>}
          </li>
        )
      })}
    </ul>
  )
}
