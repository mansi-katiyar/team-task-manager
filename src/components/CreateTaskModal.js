'use client';
import { useState, useEffect } from 'react';

export default function CreateTaskModal({ onClose, onCreated, token }) {
  const [form, setForm] = useState({ title: '', description: '', projectId: '', assignedTo: '', dueDate: '', status: 'Todo' });
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch projects
    fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setProjects(d.projects); });
    // Fetch all users for assignment
    fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setAllUsers(d.users); });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { setError('Title is required'); return; }
    if (!form.projectId) { setError('Project is required'); return; }
    setLoading(true); setError('');
    try {
      const body = { ...form };
      if (!body.assignedTo) delete body.assignedTo;
      if (!body.dueDate) delete body.dueDate;
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); setLoading(false); return; }
      onCreated(data.task);
      onClose();
    } catch { setError('Failed to create task'); setLoading(false); }
  };

  const inputStyle = { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
      <div className="glass rounded-2xl p-8 w-full max-w-lg animate-slide-in-up" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6">Create Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Title *</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" style={inputStyle} placeholder="Task title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 resize-none" style={inputStyle} placeholder="Description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Project *</label>
              <select value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} className="w-full px-4 py-3 rounded-xl text-white" style={inputStyle}>
                <option value="">Select project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Assign To</label>
              <select value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} className="w-full px-4 py-3 rounded-xl text-white" style={inputStyle}>
                <option value="">Unassigned</option>
                {allUsers.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="w-full px-4 py-3 rounded-xl text-white" style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-3 rounded-xl text-white" style={inputStyle}>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-medium" style={{ border: '1px solid rgba(148,163,184,0.2)', color: 'var(--text-secondary)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-semibold text-white btn-gradient disabled:opacity-50">{loading ? 'Creating...' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
