'use client';

export default function ProjectList({ projects, onAddMember, isAdmin }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No projects yet</p>
      </div>
    );
  }
  const gradients = ['#6366f1,#a855f7','#8b5cf6,#06b6d4','#06b6d4,#3b82f6','#f59e0b,#ef4444','#22c55e,#14b8a6'];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {projects.map((project, i) => (
        <div key={project._id} className="glass rounded-2xl p-6 glass-hover animate-slide-in-up" style={{ animationDelay: `${i*100}ms`, animationFillMode: 'backwards' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${gradients[i%5].split(',')[0]}, ${gradients[i%5].split(',')[1]})` }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            </div>
            {isAdmin && onAddMember && (
              <button onClick={() => onAddMember(project._id)} className="p-2 rounded-lg hover:bg-white/10" style={{ color: 'var(--text-secondary)' }} title="Add member">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </button>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{project.description || 'No description'}</p>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{project.members?.length || 0} members</span>
          </div>
        </div>
      ))}
    </div>
  );
}
