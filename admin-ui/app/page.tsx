import React from 'react'
import { LoginForm } from '../components/LoginForm'

export default function Page() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">Acceso Admin</h1>
        <LoginForm />
      </div>
    </main>
  )
}
