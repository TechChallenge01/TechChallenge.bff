interface Props {
  columns: string[]
  rows: Record<string, unknown>[]
  onAction?: (row: Record<string, unknown>) => void
  actionLabel?: string
}

export default function Table({ columns, rows, onAction, actionLabel = 'Ver' }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="min-w-full text-sm text-gray-200">
        <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
          <tr>
            {columns.map(col => (
              <th key={col} className="px-4 py-3 text-left font-medium">{col}</th>
            ))}
            {onAction && <th className="px-4 py-3 text-left font-medium">Ações</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onAction ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                Nenhum resultado encontrado.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                {columns.map(col => (
                  <td key={col} className="px-4 py-3">{String(row[col] ?? '')}</td>
                ))}
                {onAction && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onAction(row)}
                      className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      {actionLabel}
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
