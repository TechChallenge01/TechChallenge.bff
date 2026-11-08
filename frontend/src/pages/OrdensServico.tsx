import { useEffect, useState } from 'react'
import { ordensServico } from '../api'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { Badge } from '../components/Badge'

interface OS { id: string; clienteId: string; status: string; dataCriacao: string; descricaoProblema: string }

export default function OrdensServico() {
  const [rows, setRows] = useState<OS[]>([])
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState<OS | null>(null)
  const [form, setForm] = useState({ clienteId: '', descricaoProblema: '' })
  const [diagForm, setDiagForm] = useState({ diagnostico: '', valorEstimado: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const res = await ordensServico.list(page)
      const data = res.data as OS[] | { items: OS[] }
      setRows(Array.isArray(data) ? data : data.items ?? [])
    } catch { setRows([]) }
  }

  useEffect(() => { load() }, [page])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try { await ordensServico.create(form); setShowCreate(false); setForm({ clienteId: '', descricaoProblema: '' }); load() }
    finally { setLoading(false) }
  }

  const handleIniciarDiag = async () => {
    if (!selected) return
    await ordensServico.iniciarDiagnostico(selected.id ?? (selected as unknown as Record<string, string>)['Id'])
    load(); setSelected(null)
  }

  const handleDiagnostico = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    await ordensServico.registrarDiagnostico(selected.id ?? (selected as unknown as Record<string, string>)['Id'], { diagnostico: diagForm.diagnostico, valorEstimado: parseFloat(diagForm.valorEstimado) })
    load(); setSelected(null); setDiagForm({ diagnostico: '', valorEstimado: '' })
  }

  const handleCancelar = async () => {
    if (!selected || !confirm('Cancelar esta OS?')) return
    await ordensServico.cancelar(selected.id ?? (selected as unknown as Record<string, string>)['Id'])
    load(); setSelected(null)
  }

  const displayRows = rows.map(o => {
    const id = o.id ?? (o as unknown as Record<string, string>)['Id'] ?? ''
    const clienteId = o.clienteId ?? (o as unknown as Record<string, string>)['ClienteId'] ?? ''
    const status = o.status ?? (o as unknown as Record<string, string>)['Status'] ?? ''
    const dataCriacao = o.dataCriacao ?? (o as unknown as Record<string, string>)['DataCriacao'] ?? ''
    return { ID: id.substring(0, 8), ClienteId: clienteId.substring(0, 8), Status: status, Data: dataCriacao.substring(0, 10), _raw: o }
  })

  const sel = selected as unknown as Record<string, string> | null
  const selStatus = sel ? (sel.status ?? sel['Status'] ?? '') : ''

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Ordens de Serviço</h1>
        <button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">+ Nova OS</button>
      </div>
      <Table
        columns={['ID', 'ClienteId', 'Status', 'Data']}
        rows={displayRows}
        onAction={row => setSelected(row._raw as unknown as OS)}
        actionLabel="Ver"
      />
      <div className="flex gap-2 mt-4 justify-end">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded disabled:opacity-40">Anterior</button>
        <span className="px-3 py-1.5 text-sm text-gray-400">Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded">Próximo</button>
      </div>

      {showCreate && (
        <Modal title="Nova Ordem de Serviço" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Cliente ID</label>
              <input value={form.clienteId} onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))} required
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Descrição do Problema</label>
              <textarea value={form.descricaoProblema} onChange={e => setForm(f => ({ ...f, descricaoProblema: e.target.value }))} required rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none" />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancelar</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm rounded-lg">Criar</button>
            </div>
          </form>
        </Modal>
      )}

      {selected && (
        <Modal title="Detalhes da OS" onClose={() => { setSelected(null); setDiagForm({ diagnostico: '', valorEstimado: '' }) }}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Status:</span>
              <Badge status={selStatus} />
            </div>
            <p className="text-gray-300 text-sm">ID: {sel?.id ?? sel?.['Id']}</p>

            {selStatus === 'Recebida' && (
              <button onClick={handleIniciarDiag} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white text-sm py-2 rounded-lg transition-colors">
                Iniciar Diagnóstico
              </button>
            )}

            {selStatus === 'EmDiagnostico' && (
              <form onSubmit={handleDiagnostico} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Diagnóstico</label>
                  <textarea value={diagForm.diagnostico} onChange={e => setDiagForm(f => ({ ...f, diagnostico: e.target.value }))} required rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Valor Estimado (R$)</label>
                  <input type="number" step="0.01" value={diagForm.valorEstimado} onChange={e => setDiagForm(f => ({ ...f, valorEstimado: e.target.value }))} required
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg">Registrar Diagnóstico</button>
              </form>
            )}

            {!['Finalizada', 'Entregue', 'Cancelada'].includes(selStatus) && (
              <button onClick={handleCancelar} className="w-full bg-red-700 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition-colors">
                Cancelar OS
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
