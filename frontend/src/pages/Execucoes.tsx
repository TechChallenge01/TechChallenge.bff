import { useState } from 'react'
import { execucoes } from '../api'
import { Badge } from '../components/Badge'

interface Execucao { id: string; pedidoId: string; status: string; valorFinal?: number }

export default function Execucoes() {
  const [pedidoId, setPedidoId] = useState('')
  const [data, setData] = useState<Execucao | null>(null)
  const [valorFinal, setValorFinal] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setData(null)
    try {
      const res = await execucoes.getByPedido(pedidoId)
      setData(res.data as Execucao)
    } catch { setError('Execução não encontrada.') }
  }

  const getStatus = () => {
    const d = data as unknown as Record<string, string>
    return d?.status ?? d?.['Status'] ?? ''
  }

  const getId = () => {
    const d = data as unknown as Record<string, string>
    return d?.id ?? d?.['Id'] ?? ''
  }

  const handlePronto = async () => {
    if (!data) return
    setLoading(true)
    try {
      await execucoes.marcarPronto(getId())
      const res = await execucoes.getByPedido(pedidoId)
      setData(res.data as Execucao)
    } finally { setLoading(false) }
  }

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setLoading(true)
    try {
      await execucoes.finalizar(getId(), parseFloat(valorFinal))
      const res = await execucoes.getByPedido(pedidoId)
      setData(res.data as Execucao); setValorFinal('')
    } finally { setLoading(false) }
  }

  const status = getStatus()

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-white mb-6">Execuções</h1>
      <form onSubmit={handleBuscar} className="flex gap-3 mb-6">
        <input
          value={pedidoId}
          onChange={e => setPedidoId(e.target.value)}
          placeholder="ID do pedido (UUID)"
          required
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">Buscar</button>
      </form>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {data && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Status:</span>
            <Badge status={status} />
          </div>
          <p className="text-gray-400 text-xs">ID: {getId()}</p>

          {status === 'EmPreparacao' && (
            <button onClick={handlePronto} disabled={loading} className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-sm py-2 rounded-lg transition-colors">
              Marcar como Pronto
            </button>
          )}

          {status === 'Pronta' && (
            <form onSubmit={handleFinalizar} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Valor Final (R$)</label>
                <input type="number" step="0.01" value={valorFinal} onChange={e => setValorFinal(e.target.value)} required
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm py-2 rounded-lg transition-colors">
                Finalizar Execução
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
