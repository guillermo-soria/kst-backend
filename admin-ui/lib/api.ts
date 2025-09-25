import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000'

export async function login(email: string, password: string) {
  const r = await axios.post(`${BASE}/admin/auth/emailpass`, { email, password })
  return r.data as { token: string }
}
