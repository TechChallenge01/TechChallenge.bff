import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Produtos from './pages/Produtos'
import Estoque from './pages/Estoque'
import OrdensServico from './pages/OrdensServico'
import Execucoes from './pages/Execucoes'
import Sidebar from './components/Sidebar'

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
        <Route path="/clientes" element={<PrivateLayout><Clientes /></PrivateLayout>} />
        <Route path="/produtos" element={<PrivateLayout><Produtos /></PrivateLayout>} />
        <Route path="/estoque" element={<PrivateLayout><Estoque /></PrivateLayout>} />
        <Route path="/ordens-servico" element={<PrivateLayout><OrdensServico /></PrivateLayout>} />
        <Route path="/execucoes" element={<PrivateLayout><Execucoes /></PrivateLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
