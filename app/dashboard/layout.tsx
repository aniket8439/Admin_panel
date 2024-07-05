// dashboard/layout.tsx
"use client"
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} onToggleSidebar={handleToggleSidebar} />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'} flex-1 p-8`}>
        {children}
      </div>
    </div>
  );
}
