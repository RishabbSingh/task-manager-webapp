import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import TaskModal from '../components/TaskModal'
import TaskCard from '../components/TaskCard'
import SkeletonCard from '../components/SkeletonCard'
import KanbanBoard from '../components/KanbanBoard'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [stats, setStats] = useState({})
  const [view, setView] = useState('list')
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', page: 1, limit: 8 })
  const [modalState, setModalState] = useState({ open: false, task: null })
  const [darkMode, setDarkMode] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
      const { data } = await api.get('/tasks', { params })
      setTasks(data.data)
      setPagination(data.pagination)
      setStats(data.stats)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}`)
      toast.success('Task deleted')
      fetchTasks()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status })
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t))
    } catch {
      toast.error('Failed to update')
    }
  }

  const totalTasks = (stats.Pending || 0) + (stats['In Progress'] || 0) + (stats.Completed || 0)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center font-black text-black text-sm">T</div>
              <span className="font-black text-lg tracking-tight">TaskFlow</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400 hidden sm:block">
                Hi, <span className="text-white font-semibold">{user?.name}</span>
              </span>
              <button onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white">
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={() => { logout(); toast.success('Logged out') }}
                className="px-4 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors font-medium">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
            {[
              { label: 'Total', value: totalTasks, color: 'text-zinc-100', bg: 'bg-zinc-800' },
              { label: 'Pending', value: stats.Pending || 0, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'In Progress', value: stats['In Progress'] || 0, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Completed', value: stats.Completed || 0, color: 'text-brand-400', bg: 'bg-brand-500/10' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4 border border-white/5`}>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-3xl font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
              <input type="text" placeholder="Search tasks..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
            </div>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors">
              <option value="">All Status</option>
              <option>Pending</option><option>In Progress</option><option>Completed</option>
            </select>
            <select value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value, page: 1 })}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors">
              <option value="">All Priority</option>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {['list', 'kanban'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors capitalize ${view === v ? 'bg-brand-500 text-black' : 'text-zinc-400 hover:text-white'}`}>
                  {v === 'list' ? '☰' : '⊞'} {v}
                </button>
              ))}
            </div>
            <button onClick={() => setModalState({ open: true, task: null })}
              className="bg-brand-500 hover:bg-brand-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all text-sm whitespace-nowrap flex items-center gap-2">
              <span className="text-lg leading-none">+</span> New Task
            </button>
          </div>

          {/* Content */}
          {view === 'kanban' ? (
            <KanbanBoard tasks={tasks} onUpdate={fetchTasks} onDelete={handleDelete}
              onEdit={(task) => setModalState({ open: true, task })} />
          ) : (
            <>
              {loading ? (
                <div className="grid gap-3">
                  {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-20 animate-fade-in">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="text-xl font-bold text-zinc-300 mb-2">No tasks yet</h3>
                  <p className="text-zinc-500 text-sm mb-6">Create your first task to get started</p>
                  <button onClick={() => setModalState({ open: true, task: null })}
                    className="bg-brand-500 hover:bg-brand-400 text-black font-bold px-6 py-2.5 rounded-xl transition-all text-sm">
                    + Create Task
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {tasks.map((task, i) => (
                    <TaskCard key={task._id} task={task} index={i}
                      onEdit={() => setModalState({ open: true, task })}
                      onDelete={() => handleDelete(task._id)}
                      onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button disabled={!pagination.hasPrev}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-lg text-sm transition-colors">
                    ← Prev
                  </button>
                  <span className="text-sm text-zinc-400 px-4">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button disabled={!pagination.hasNext}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-lg text-sm transition-colors">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {modalState.open && (
          <TaskModal task={modalState.task}
            onClose={() => setModalState({ open: false, task: null })}
            onSave={() => { fetchTasks(); setModalState({ open: false, task: null }) }} />
        )}
      </div>
    </div>
  )
}
