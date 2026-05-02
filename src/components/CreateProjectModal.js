'use client';
import { useState } from 'react';

export default function CreateProjectModal({ onClose, onCreated, token }) {
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { setError('Title is required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); setLoading(false); return; }
      onCreated(data.project);
      onClose();
    } catch { setError('Failed to create project'); setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
      <div className="glass rounded-2xl p-8 w-full max-w-md animate-slide-in-up" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6">Create Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Title *</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} placeholder="Project name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 resize-none" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} placeholder="Project description" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-medium" style={{ border: '1px solid rgba(148,163,184,0.2)', color: 'var(--text-secondary)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-semibold text-white btn-gradient disabled:opacity-50">{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
