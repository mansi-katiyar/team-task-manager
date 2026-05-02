'use client';
import { useState } from 'react';

export default function AddMemberModal({ projectId, onClose, onAdded, token }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); setLoading(false); return; }
      onAdded(data.project);
      onClose();
    } catch { setError('Failed to add member'); setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
      <div className="glass rounded-2xl p-8 w-full max-w-md animate-slide-in-up" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6">Add Team Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Member Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)' }} placeholder="member@example.com" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-medium" style={{ border: '1px solid rgba(148,163,184,0.2)', color: 'var(--text-secondary)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-semibold text-white btn-gradient disabled:opacity-50">{loading ? 'Adding...' : 'Add Member'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
