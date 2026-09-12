import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Bell, Menu, Bot, User, AlertOctagon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { userProfile, criticalStockCount, unreadNotificationsCount } = useShop();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm"
          title="Toggle Navigation Sidebar"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={18} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            {userProfile.shopName}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            AI-Powered Inventory & Assistant
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Critical Stock Header Alert Quick Button */}
        {criticalStockCount > 0 && (
          <button 
            onClick={() => navigate('/alerts')}
            className="btn btn-danger btn-sm"
            style={{ gap: '0.4rem', animation: 'pulseRed 2s infinite' }}
          >
            <AlertOctagon size={16} />
            <span>{criticalStockCount} Critical</span>
          </button>
        )}

        {/* AI Quick Assistant Link */}
        <Link to="/ai-assistant" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
          <Bot size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ display: 'inline' }}>Ask AI</span>
        </Link>

        {/* Notification Bell with Badge */}
        <Link 
          to="/alerts" 
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          className="btn btn-secondary btn-sm"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--status-critical)',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadNotificationsCount}
            </span>
          )}
        </Link>

        {/* User Profile Badge */}
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.5rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            <User size={18} />
          </div>
        </Link>
      </div>
    </header>
  );
};
