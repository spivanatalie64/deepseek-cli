import React, { useState } from 'react'

export default function SearchForm({ onSubmit, loading }) {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(10)

  async function handleSubmit(e) {
    e && e.preventDefault && e.preventDefault()
    if (!onSubmit) return
    await onSubmit({ query, limit })
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search query"
        disabled={loading}
      />

      <select
        className="search-limit"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        disabled={loading}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>

      <button className="btn btn-search" type="submit" disabled={loading || !query}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
