import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const cards = [
  { label: 'Ordens de Serviço', path: '/ordens-servico', desc: 'Criar e acompanhar OSs' },
  { label: 'Clientes', path: '/clientes', desc: 'Cadastro de clientes' },
  { label: 'Produtos', path: '/produtos', desc: 'Peças e insumos' },
  { label: 'Estoque', path: '/estoque', desc: 'Níveis e ajustes' },
  { label: 'Execuções', path: '/execucoes', desc: 'Acompanhar execuções' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Olá, {user?.nome ?? 'usuário'}!</h1>
      <p className="text-gray-400 text-sm mb-8">Bem-vindo ao TechChallenge — sistema de gestão da oficina.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-left hover:border-indigo-600 hover:bg-gray-800 transition-all"
          >
            <p className="text-white font-semibold text-sm mb-1">{card.label}</p>
            <p className="text-gray-400 text-xs">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
