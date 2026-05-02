'use client';

export default function TaskTable({ tasks, onStatusChange, isAdmin }) {
  const getStatusBadge = (status) => {
    const classes = {
      'Todo': 'badge-todo',
      'In Progress': 'badge-progress',
      'Done': 'badge-done',
    };
    return classes[status] || 'badge-todo';
  };

  const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'Done') return false;
    return new Date(dueDate) < new Date();
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No tasks yet</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Create a task to get started</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Task</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Project</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Assigned To</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Due Date</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr
                key={task._id}
                className="transition-colors duration-150 hover:bg-white/5 animate-fade-in"
                style={{
                  borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: 'backwards',
                }}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-white">{task.title}</p>
                    {task.description && (
                      <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {task.projectId?.title || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {task.assignedTo?.name || 'Unassigned'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${isOverdue(task.dueDate, task.status) ? 'text-red-400 font-semibold' : ''}`} style={!isOverdue(task.dueDate, task.status) ? { color: 'var(--text-secondary)' } : {}}>
                    {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate, task.status) && <span className="ml-1 text-xs">⚠️</span>}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {onStatusChange ? (
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer ${getStatusBadge(task.status)}`}
                      style={{ background: 'transparent' }}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  ) : (
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
