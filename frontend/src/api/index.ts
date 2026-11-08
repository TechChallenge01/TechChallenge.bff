import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const auth = {
  login: (cpf: string) => api.post('/auth/login', { cpf }),
}

export const clientes = {
  list: (page = 1, pageSize = 10) => api.get(`/clientes?page=${page}&pageSize=${pageSize}`),
  get: (id: string) => api.get(`/clientes/${id}`),
  create: (data: unknown) => api.post('/clientes', data),
  update: (id: string, data: unknown) => api.put(`/clientes/${id}`, data),
  remove: (id: string) => api.delete(`/clientes/${id}`),
}

export const produtos = {
  list: (page = 1, pageSize = 10) => api.get(`/produtos?page=${page}&pageSize=${pageSize}`),
  get: (id: string) => api.get(`/produtos/${id}`),
  create: (data: unknown) => api.post('/produtos', data),
  update: (id: string, data: unknown) => api.put(`/produtos/${id}`, data),
  remove: (id: string) => api.delete(`/produtos/${id}`),
}

export const categorias = {
  list: () => api.get('/categorias'),
  create: (data: unknown) => api.post('/categorias', data),
}

export const estoque = {
  get: (produtoId: string) => api.get(`/estoque/${produtoId}`),
  adicionar: (data: unknown) => api.post('/estoque', data),
  ajustar: (produtoId: string, data: unknown) => api.put(`/estoque/${produtoId}/ajustar`, data),
}

export const ordensServico = {
  list: (page = 1, pageSize = 10) => api.get(`/ordens-servico?page=${page}&pageSize=${pageSize}`),
  get: (id: string) => api.get(`/ordens-servico/${id}`),
  create: (data: unknown) => api.post('/ordens-servico', data),
  cancelar: (id: string) => api.delete(`/ordens-servico/${id}`),
  iniciarDiagnostico: (id: string) => api.post(`/ordens-servico/${id}/iniciar-diagnostico`),
  registrarDiagnostico: (id: string, data: unknown) => api.post(`/ordens-servico/${id}/diagnostico`, data),
}

export const orcamentos = {
  list: (page = 1, pageSize = 10) => api.get(`/orcamentos?page=${page}&pageSize=${pageSize}`),
  get: (id: string) => api.get(`/orcamentos/${id}`),
  aprovar: (id: string, emailCliente: string) => api.post(`/orcamentos/${id}/aprovar`, { emailCliente }),
  rejeitar: (id: string, motivo: string) => api.post(`/orcamentos/${id}/rejeitar`, { motivo }),
}

export const execucoes = {
  get: (id: string) => api.get(`/execucoes/${id}`),
  getByPedido: (pedidoId: string) => api.get(`/execucoes/pedido/${pedidoId}`),
  marcarPronto: (id: string) => api.put(`/execucoes/${id}/pronto`),
  finalizar: (id: string, valorFinal: number) => api.put(`/execucoes/${id}/finalizar`, { valorFinal }),
}

export const pagamentos = {
  get: (id: string) => api.get(`/pagamentos/${id}`),
}
