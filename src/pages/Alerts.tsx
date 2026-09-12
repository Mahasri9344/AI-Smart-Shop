import React from 'react';
import { useShop } from '../context/ShopContext';
import { Bell, Check, Trash2, AlertOctagon, AlertTriangle } from 'lucide-react';

export const Alerts: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useShop();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Proactive Notifications & Alerts Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Automated stock alerts, low threshold warnings & AI insights
          </p>
        </div>

        <button onClick={clearAllNotifications} className="btn btn-secondary btn-sm">
          <Trash2 size={16} />
          <span>Clear All Alerts</span>
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Bell size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <div>No active notifications at present. All inventory is stable.</div>
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: notif.type === 'CRITICAL_STOCK' ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-sidebar)',
                  border: `1px solid ${notif.type === 'CRITICAL_STOCK' ? 'var(--status-critical-border)' : 'var(--border-color)'}`,
                  opacity: notif.read ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ marginTop: '0.15rem' }}>
                    {notif.type === 'CRITICAL_STOCK' ? (
                      <AlertOctagon size={22} style={{ color: 'var(--status-critical)' }} />
                    ) : (
                      <AlertTriangle size={22} style={{ color: 'var(--status-low)' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: notif.type === 'CRITICAL_STOCK' ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {notif.message}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      {new Date(notif.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {!notif.read && (
                  <button 
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="btn btn-secondary btn-sm"
                    title="Mark as read"
                  >
                    <Check size={14} />
                    <span>Mark Read</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
