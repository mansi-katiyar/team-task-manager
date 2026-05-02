import './globals.css';

export const metadata = {
  title: 'Team Task Manager',
  description: 'A powerful team task management application with role-based access control, project management, and real-time task tracking.',
  keywords: ['task manager', 'project management', 'team collaboration', 'task tracking'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
