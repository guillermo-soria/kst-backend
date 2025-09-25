'use client'

import React, { useState } from 'react'
import { login } from '../lib/api'

export function LoginForm() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login(email, password)
      setToken(res.token)
    } catch (e: any) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full border rounded px-2 py-1" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {token && <p className="text-xs break-all text-green-600">JWT: {token}</p>}
      <button disabled={loading} className="w-full bg-black text-white py-2 rounded disabled:opacity-50">
        {loading ? '...' : 'Entrar'}
      </button>
    </form>
  )
}
