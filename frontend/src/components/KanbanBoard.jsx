import api from '../utils/api'

const COLUMNS = ['Pending', 'In Progress', 'Completed']
const COL_STYLES = {
  Pending: 'border-amber-500/20',
  'In Progress': 'border-blue-500/20',
  Completed: 'border-brand-500/20',
}

export default function KanbanBoard({ tasks, onUpdate, onDelete, onEdit }) {
  const getColumnTasks = (status) => tasks.filter(t => t.status === status)

  const handleDrop = async (e, status) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    try {
      await api.put(`/tasks/${taskId}`, { status })
      onUpdate()
    } catch {}
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
      {COLUMNS.map(col => (
        <div key={col}
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e, col)}
          className={`bg-zinc-900/50 border ${COL_STYLES[col]} rounded-2xl p-4 min-h-[300px]`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-300">{col}</h3>
            <span className="text-xs font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
              {getColumnTasks(col).length}
            </span>
          </div>
          <div className="space-y-2">
            {getColumnTasks(col).map(task => (
              <div key={task._id} draggable
                onDragStart={e => e.dataTransfer.setData('taskId', task._id)}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 cursor-grab active:cursor-grabbing group transition-all">
                <p className="text-sm font-medium text-zinc-200 mb-2">{task.title}</p>
                {task.description && (
                  <p className="text-xs text-zinc-500 mb-2 line-clamp-2">{task.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    task.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                    task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-blue-500/10 text-blue-400'}`}>
                    {task.priority}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(task)} className="text-xs p-1 hover:bg-zinc-700 rounded transition-colors">✏️</button>
                    <button onClick={() => onDelete(task._id)} className="text-xs p-1 hover:bg-red-500/10 rounded transition-colors">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
            {getColumnTasks(col).length === 0 && (
              <div className="border-2 border-dashed border-zinc-800 rounded-xl p-6 text-center text-zinc-600 text-xs">
                Drop tasks here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
