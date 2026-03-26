import { format } from 'date-fns'

const PRIORITY = {
  Low: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  High: 'bg-red-500/10 text-red-400 border border-red-500/20',
}
const STATUS_DOT = {
  Pending: 'bg-zinc-500',
  'In Progress': 'bg-blue-400',
  Completed: 'bg-brand-400',
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, index = 0 }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed'

  return (
    <div className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl px-5 py-4 transition-all duration-200 animate-slide-up flex items-start gap-4"
      style={{ animationDelay: `${index * 0.04}s` }}>
      <div className="mt-1.5 flex-shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[task.status]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`font-semibold text-sm leading-snug ${task.status === 'Completed' ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors text-xs">✏️</button>
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors text-xs">🗑️</button>
          </div>
        </div>
        {task.description && (
          <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${PRIORITY[task.priority]}`}>
            {task.priority}
          </span>
          <select value={task.status} onChange={e => onStatusChange(task._id, e.target.value)}
            className="text-[11px] font-medium bg-zinc-800 border border-zinc-700 rounded-md px-2 py-0.5 focus:outline-none focus:border-brand-500 transition-colors cursor-pointer">
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          {task.dueDate && (
            <span className={`text-[11px] font-medium ${isOverdue ? 'text-red-400' : 'text-zinc-500'}`}>
              {isOverdue ? '⚠️ ' : '📅 '}
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
