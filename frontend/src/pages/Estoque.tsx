import { useState } from 'react'
import { estoque } from '../api'

interface EstoqueData { produtoId: string; quantidadeDisponivel: number; quantidadeReservada: number }

export default function Estoque() {
  const [produtoId, setProdutoId] = useState('')
  const [data, setData] = useState<EstoqueData | null>(null)
  const [ajuste, setAjuste] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setData(null)
    try {
      const res = await estoque.get(produtoId)
      setData(res.data as EstoqueData)
    } catch { setError('Produto não encontrado no estoque.') }
  }

  const handleAjustar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await estoque.ajustar(produtoId, { novaQuantidade: parseInt(ajuste) })
      setAjuste('')
      const res = await estoque.get(produtoId)
      setData(res.data as EstoqueData)
    } catch { setError('Erro ao ajustar estoque.') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-white mb-6">Estoque</h1>
      <form onSubmit={handleBuscar} className="flex gap-3 mb-6">
        <input
          value={produtoId}
          onChange={e => setProdutoId(e.target.value)}
          placeholder="ID do produto (UUID)"
          required
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">Buscar</button>
      </form>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {data && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Disponível</p>
              <p className="text-white text-2xl font-bold">{data.quantidadeDisponivel ?? (data as unknown as Record<string, number>)['QuantidadeDisponivel']}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Reservado</p>
              <p className="text-white text-2xl font-bold">{data.quantidadeReservada ?? (data as unknown as Record<string, number>)['QuantidadeReservada']}</p>
            </div>
          </div>
          <form onSubmit={handleAjustar} className="flex gap-3 pt-2">
            <input
              type="number"
              value={ajuste}
              onChange={e => setAjuste(e.target.value)}
              placeholder="Nova quantidade"
              required
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors">Ajustar</button>
          </form>
        </div>
      )}
    </div>
  )
}
