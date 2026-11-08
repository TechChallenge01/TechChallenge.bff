const colors: Record<string, string> = {
  Recebida: 'bg-blue-600',
  EmDiagnostico: 'bg-yellow-600',
  AguardandoAprovacao: 'bg-orange-500',
  EmExecucao: 'bg-purple-600',
  Finalizada: 'bg-green-600',
  Entregue: 'bg-teal-600',
  Cancelada: 'bg-red-600',
  EmPreparacao: 'bg-yellow-500',
  Pronta: 'bg-green-500',
  Falhou: 'bg-red-500',
  Ativo: 'bg-green-600',
  Inativo: 'bg-gray-600',
  Pendente: 'bg-yellow-500',
  Pago: 'bg-green-600',
}

export function Badge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${colors[status] ?? 'bg-gray-600'}`}>
      {status}
    </span>
  )
}
