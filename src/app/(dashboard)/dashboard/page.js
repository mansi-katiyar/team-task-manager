'use client';
import { useEffect, useState } from 'react';
import DashboardCard from '@/components/DashboardCard';
import TaskTable from '@/components/TaskTable';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    Promise.all([
      fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/tasks/overdue', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([tasksData, overdueData]) => {
      if (tasksData.success) {
        const tasks = tasksData.tasks;
        setStats({
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'Done').length,
          pending: tasks.filter(t => t.status !== 'Done').length,
          overdue: overdueData.success ? overdueData.tasks.length : 0,
        });
        setRecentTasks(tasks.slice(0, 5));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  const icons = {
    total: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    done: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    pending: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    overdue: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Welcome back! Here&apos;s your task overview.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Total Tasks" value={stats.total} icon={icons.total} color="violet" delay={0} />
        <DashboardCard title="Completed" value={stats.completed} icon={icons.done} color="green" delay={100} />
        <DashboardCard title="Pending" value={stats.pending} icon={icons.pending} color="amber" delay={200} />
        <DashboardCard title="Overdue" value={stats.overdue} icon={icons.overdue} color="red" delay={300} />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
        <h2 className="text-xl font-bold text-white mb-4">Recent Tasks</h2>
        <TaskTable tasks={recentTasks} />
      </div>
    </div>
  );
}
