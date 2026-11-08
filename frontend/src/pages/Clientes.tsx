import { useEffect, useState } from 'react'
import { clientes } from '../api'
import Table from '../components/Table'
import Modal from '../components/Modal'

interface Cliente { id: string; nome: string; cpf: string; email: string; status: string }

export default function Clientes() {
  const [rows, setRows] = useState<Cliente[]>([])
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nome: '', cpf: '', email: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const res = await clientes.list(page)
      const data = res.data as Cliente[] | { items: Cliente[] }
      setRows(Array.isArray(data) ? data : data.items ?? [])
    } catch { setRows([]) }
  }

  useEffect(() => { load() }, [page])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await clientes.create(form)
      setShowModal(false)
      setForm({ nome: '', cpf: '', email: '' })
      load()
    } finally { setLoading(false) }
  }

  const displayRows = rows.map(c => ({ Nome: c.nome ?? c['Nome'], CPF: c.cpf ?? c['Cpf'], Email: c.email ?? c['Email'], Status: c.status ?? c['Status'], _id: c.id ?? c['Id'] }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Clientes</h1>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          + Novo Cliente
        </button>
      </div>
      <Table columns={['Nome', 'CPF', 'Email', 'Status']} rows={displayRows} />
      <div className="flex gap-2 mt-4 justify-end">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded disabled:opacity-40">Anterior</button>
        <span className="px-3 py-1.5 text-sm text-gray-400">Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded">Próximo</button>
      </div>
      {showModal && (
        <Modal title="Novo Cliente" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {(['nome', 'cpf', 'email'] as const).map(field => (
              <div key={field}>
                <label className="block text-xs text-gray-400 mb-1 capitalize">{field}</label>
                <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
            ))}
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
