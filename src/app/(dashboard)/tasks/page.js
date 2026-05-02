'use client';
import { useEffect, useState } from 'react';
import TaskTable from '@/components/TaskTable';
import CreateTaskModal from '@/components/CreateTaskModal';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t) setToken(t);
    if (u) try { setUser(JSON.parse(u)); } catch {}
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setTasks(d.tasks);
        } else {
          console.error('Failed to fetch tasks:', d.error);
        }
        setLoading(false);
      })
      .catch((err) => { console.error('Tasks fetch error:', err); setLoading(false); });
  }, [token]);

  const isAdmin = user?.role === 'admin';

  const handleCreated = (task) => {
    setTasks([task, ...tasks]);
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(tasks.map(t => t._id === taskId ? data.task : t));
      }
    } catch (err) { console.error('Status update failed', err); }
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  const filters = ['all', 'Todo', 'In Progress', 'Done'];
  const filterColors = { all: '#6366f1', Todo: '#f59e0b', 'In Progress': '#3b82f6', Done: '#22c55e' };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button id="create-task-btn" onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white btn-gradient">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Task
          </button>
        )}
      </div>
      {/* Filters */}
      <div className="flex gap-2 mb-6 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={filter === f ? { background: `${filterColors[f]}22`, color: filterColors[f], border: `1px solid ${filterColors[f]}44` } : { color: 'var(--text-secondary)', border: '1px solid transparent' }}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>
      <TaskTable tasks={filtered} onStatusChange={handleStatusChange} isAdmin={isAdmin} />
      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} onCreated={handleCreated} token={token} />}
    </div>
  );
}
