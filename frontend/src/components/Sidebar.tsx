import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/ordens-servico', label: 'Ordens de Serviço' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/produtos', label: 'Produtos' },
  { to: '/estoque', label: 'Estoque' },
  { to: '/execucoes', label: 'Execuções' },
]

export default function Sidebar() {
  const { logout } = useAuth()
  return (
    <aside className="w-56 bg-gray-900 flex flex-col h-full border-r border-gray-800">
      <div className="px-4 py-5 border-b border-gray-800">
        <span className="text-white font-bold text-lg tracking-tight">TechChallenge</span>
      </div>
      <nav className="flex-1 py-4 space-y-0.5">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-700 text-white font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full text-left text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}
