import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users, 
  Bot, 
  Bell, 
  BarChart3, 
  Settings, 
  User, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse, mobileOpen }) => {
  const { criticalStockCount, unreadNotificationsCount } = useShop();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Inventory', icon: Package, path: '/inventory' },
    { label: 'Sales Management', icon: ShoppingCart, path: '/sales' },
    { label: 'Purchases (Stock-In)', icon: Truck, path: '/purchases' },
    { label: 'Suppliers', icon: Users, path: '/suppliers' },
    { 
      label: 'AI Smart Assistant', 
      icon: Bot, 
      path: '/ai-assistant',
      badge: 'AI'
    },
    { 
      label: 'Alerts & Notifications', 
      icon: Bell, 
      path: '/alerts',
      badgeCount: criticalStockCount || unreadNotificationsCount
    },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'My Profile', icon: User, path: '/profile' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        {!collapsed ? (
          <div className="sidebar-brand">
            <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
            <span>AI SMART SHOP</span>
          </div>
        ) : (
          <div className="sidebar-brand" style={{ justifyContent: 'center', width: '100%' }}>
            <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
        )}

        <button 
          onClick={onToggleCollapse} 
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.35rem', borderRadius: '50%' }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
            
            {!collapsed && item.badge && (
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: 'var(--accent-primary)',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                color: '#fff'
              }}>
                {item.badge}
              </span>
            )}

            {!collapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.72rem',
                fontWeight: 800,
                backgroundColor: 'var(--status-critical)',
                padding: '0.1rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                color: '#fff'
              }}>
                {item.badgeCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer login link / quick logout option */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <NavLink
          to="/login"
          className="nav-item"
          style={{ color: 'var(--text-muted)' }}
          title={collapsed ? "Login / Auth" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Login / Demo Auth</span>}
        </NavLink>
      </div>
    </aside>
  );
};
