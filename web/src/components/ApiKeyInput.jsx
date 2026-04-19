import React, { useEffect, useState } from 'react'

export default function ApiKeyInput({ apiKey: initialKey, onChange }) {
  const [key, setKey] = useState(initialKey || '')

  useEffect(() => {
    setKey(initialKey || '')
  }, [initialKey])

  function saveKey() {
    try {
      if (key) {
        localStorage.setItem('deepseek_api_key', key)
        window.__DEEPSEEK_API_KEY = key
      } else {
        localStorage.removeItem('deepseek_api_key')
        try { delete window.__DEEPSEEK_API_KEY } catch (e) { window.__DEEPSEEK_API_KEY = undefined }
      }
      if (onChange) onChange(key)
    } catch (e) {
      console.error('Failed to save API key', e)
    }
  }

  function clearKey() {
    setKey('')
    try {
      localStorage.removeItem('deepseek_api_key')
      try { delete window.__DEEPSEEK_API_KEY } catch (e) { window.__DEEPSEEK_API_KEY = undefined }
    } catch (e) {
      console.error('Failed to clear API key', e)
    }
    if (onChange) onChange('')
  }

  return (
    <div className="api-key-input">
      <label className="api-key-label">API Key</label>
      <div className="api-key-controls">
        <input
          className="api-key-field"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter DeepSeek API key"
          type="password"
        />
        <button type="button" onClick={saveKey} className="btn btn-primary">Save</button>
        <button type="button" onClick={clearKey} className="btn">Clear</button>
      </div>
    </div>
  )
}
