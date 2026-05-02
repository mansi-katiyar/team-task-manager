'use client';

export default function DashboardCard({ title, value, icon, color, delay = 0 }) {
  const colors = {
    violet: { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)', text: '#a5b4fc', icon: '#6366f1' },
    green: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', text: '#86efac', icon: '#22c55e' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', text: '#fcd34d', icon: '#f59e0b' },
    red: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5', icon: '#ef4444' },
    cyan: { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.2)', text: '#67e8f9', icon: '#06b6d4' },
  };

  const c = colors[color] || colors.violet;

  return (
    <div
      className="glass rounded-2xl p-6 glass-hover animate-slide-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</p>
          <p className="text-4xl font-bold animate-count-up" style={{ color: c.text, animationDelay: `${delay + 200}ms`, animationFillMode: 'backwards' }}>
            {value}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <span style={{ color: c.icon }}>{icon}</span>
        </div>
      </div>
    </div>
  );
}
