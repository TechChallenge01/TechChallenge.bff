import { useEffect, useState } from 'react'
import { produtos, categorias } from '../api'
import Table from '../components/Table'
import Modal from '../components/Modal'

interface Produto { id: string; nome: string; descricao: string; preco: number; categoriaId: string; status: string }
interface Categoria { id: string; nome: string }

export default function Produtos() {
  const [rows, setRows] = useState<Produto[]>([])
  const [cats, setCats] = useState<Categoria[]>([])
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', categoriaId: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const [pRes, cRes] = await Promise.all([produtos.list(page), categorias.list()])
      const pData = pRes.data as Produto[] | { items: Produto[] }
      setRows(Array.isArray(pData) ? pData : pData.items ?? [])
      setCats(cRes.data as Categoria[])
    } catch { setRows([]) }
  }

  useEffect(() => { load() }, [page])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await produtos.create({ ...form, preco: parseFloat(form.preco) })
      setShowModal(false)
      setForm({ nome: '', descricao: '', preco: '', categoriaId: '' })
      load()
    } finally { setLoading(false) }
  }

  const displayRows = rows.map(p => ({
    Nome: p.nome ?? p['Nome'], Descrição: p.descricao ?? p['Descricao'],
    Preço: `R$ ${Number(p.preco ?? p['Preco'] ?? 0).toFixed(2)}`,
    CategoriaId: String(p.categoriaId ?? p['CategoriaId'] ?? '').substring(0, 8),
    Status: p.status ?? p['Status'],
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Produtos</h1>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          + Novo Produto
        </button>
      </div>
      <Table columns={['Nome', 'Descrição', 'Preço', 'CategoriaId', 'Status']} rows={displayRows} />
      <div className="flex gap-2 mt-4 justify-end">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded disabled:opacity-40">Anterior</button>
        <span className="px-3 py-1.5 text-sm text-gray-400">Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded">Próximo</button>
      </div>
      {showModal && (
        <Modal title="Novo Produto" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Descrição</label>
              <input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} required
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Preço</label>
              <input type="number" step="0.01" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} required
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Categoria</label>
              <select value={form.categoriaId} onChange={e => setForm(f => ({ ...f, categoriaId: e.target.value }))} required
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600">
                <option value="">Selecione...</option>
                {cats.map((c: Categoria) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancelar</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm rounded-lg">Criar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
