import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { auth } from '../api'

interface AuthState { token: string; nome: string; clienteId: string }
interface AuthCtx {
  user: AuthState | null
  login: (cpf: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = localStorage.getItem('user')
  const [user, setUser] = useState<AuthState | null>(stored ? JSON.parse(stored) : null)

  const login = useCallback(async (cpf: string) => {
    const res = await auth.login(cpf)
    const data = res.data as AuthState & { token: string; Token?: string; Nome?: string; ClienteId?: string }
    const token = data.token ?? data.Token ?? ''
    const nome = data.nome ?? data.Nome ?? ''
    const clienteId = data.clienteId ?? data.ClienteId ?? ''
    const state: AuthState = { token, nome, clienteId }
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(state))
    setUser(state)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
