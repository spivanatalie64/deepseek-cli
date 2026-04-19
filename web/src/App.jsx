import React, { useEffect, useState } from 'react'
import './styles.css'
import ApiKeyInput from './components/ApiKeyInput'
import SearchForm from './components/SearchForm'
import ResultsList from './components/ResultsList'

export default function App() {
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem('deepseek_api_key') || ''
    } catch (e) {
      return ''
    }
  })

  useEffect(() => {
    if (apiKey) {
      window.__DEEPSEEK_API_KEY = apiKey
    } else {
      try { delete window.__DEEPSEEK_API_KEY } catch (e) { window.__DEEPSEEK_API_KEY = undefined }
    }
  }, [apiKey])

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSearch({ query, limit } = {}) {
    setLoading(true)
    try {
      const apiClient = await import('./apiClient')
      const resp = await apiClient.search(query, { apiKey: window.__DEEPSEEK_API_KEY })
      let items = []
      if (Array.isArray(resp)) items = resp
      else if (resp && Array.isArray(resp.results)) items = resp.results
      else if (resp && Array.isArray(resp.items)) items = resp.items
      setResults(items.slice(0, limit || items.length))
    } catch (e) {
      console.error('Search failed', e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>DeepSeek</h1>
        <p className="tagline">A minimal Vite + React frontend scaffold.</p>
      </header>

      <main>
        <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />
        <SearchForm onSubmit={handleSearch} loading={loading} />
        <ResultsList results={results} />
      </main>
    </div>
  )
}
