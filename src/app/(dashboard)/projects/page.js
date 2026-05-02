'use client';
import { useEffect, useState } from 'react';
import ProjectList from '@/components/ProjectList';
import CreateProjectModal from '@/components/CreateProjectModal';
import AddMemberModal from '@/components/AddMemberModal';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [addMemberProject, setAddMemberProject] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t) setToken(t);
    if (u) try { setUser(JSON.parse(u)); } catch {}
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProjects(d.projects);
        } else {
          console.error('Failed to fetch projects:', d.error);
        }
        setLoading(false);
      })
      .catch((err) => { console.error('Projects fetch error:', err); setLoading(false); });
  }, [token]);

  const isAdmin = user?.role === 'admin';

  const handleCreated = (project) => {
    setProjects([project, ...projects]);
  };

  const handleMemberAdded = (updated) => {
    setProjects(projects.map(p => p._id === updated._id ? updated : p));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button id="create-project-btn" onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white btn-gradient">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Project
          </button>
        )}
      </div>
      <ProjectList projects={projects} onAddMember={id => setAddMemberProject(id)} isAdmin={isAdmin} />
      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onCreated={handleCreated} token={token} />}
      {addMemberProject && <AddMemberModal projectId={addMemberProject} onClose={() => setAddMemberProject(null)} onAdded={handleMemberAdded} token={token} />}
    </div>
  );
}
