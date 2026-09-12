import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setCollapsed(prev => !prev);
  };

  const toggleMobileOpen = () => {
    setMobileOpen(prev => !prev);
  };

  return (
    <div className="app-container">
      <Sidebar 
        collapsed={collapsed} 
        onToggleCollapse={toggleSidebarCollapse}
        mobileOpen={mobileOpen}
      />

      <div 
        className="main-wrapper" 
        style={{ marginLeft: collapsed ? '80px' : '260px' }}
      >
        <Header onToggleSidebar={toggleMobileOpen} />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
