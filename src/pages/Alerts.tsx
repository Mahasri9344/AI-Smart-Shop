import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Bell, Check, Trash2, AlertOctagon, AlertTriangle, ShoppingCart, PackageCheck } from 'lucide-react';
import { RecordPurchaseModal } from '../components/purchases/RecordPurchaseModal';

export const Alerts: React.FC = () => {
  const { products, notifications, markNotificationAsRead, clearAllNotifications } = useShop();

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedReorderProductId, setSelectedReorderProductId] = useState<string | undefined>(undefined);

  const handleOpenReorder = (productId: string) => {
    setSelectedReorderProductId(productId);
    setIsPurchaseModalOpen(true);
  };

  // Filter low and critical stock items for quick reorder summary
  const lowOrCriticalProducts = products.filter(
    p => p.status === 'CRITICAL' || p.status === 'LOW'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Proactive Notifications & Alerts Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Automated stock alerts, low threshold warnings & instant wholesale reordering
          </p>
        </div>

        <button onClick={clearAllNotifications} className="btn btn-secondary btn-sm">
          <Trash2 size={16} />
          <span>Clear All Alerts</span>
        </button>
      </div>

      {/* Quick Reorder Actions Summary for Critical & Low Stock Products */}
      {lowOrCriticalProducts.length > 0 && (
        <div 
          className="card" 
          style={{ 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertOctagon size={20} style={{ color: 'var(--status-critical)' }} />
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                Urgent Reorder Required ({lowOrCriticalProducts.length} items low or critical)
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click Reorder to launch replenishment purchase modal
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {lowOrCriticalProducts.map(prod => {
              const isCritical = prod.status === 'CRITICAL';
              return (
                <div 
                  key={prod.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-card)',
                    border: `1px solid ${isCritical ? 'var(--status-critical-border)' : 'var(--status-low-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {prod.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Stock: <strong style={{ color: isCritical ? 'var(--status-critical)' : 'var(--status-low)' }}>
                        {prod.quantity} {prod.unit}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenReorder(prod.id)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: isCritical ? 'var(--status-critical)' : 'var(--primary-color)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      boxShadow: isCritical ? '0 2px 8px rgba(239, 68, 68, 0.3)' : '0 2px 8px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    <ShoppingCart size={14} />
                    <span>{isCritical ? 'Reorder Now' : 'Reorder'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notifications History List */}
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Bell size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <div>No active notifications at present. All inventory is stable.</div>
            </div>
          ) : (
            notifications.map(notif => {
              const product = notif.productId ? products.find(p => p.id === notif.productId) : undefined;
              const isCriticalAlert = notif.type === 'CRITICAL_STOCK' || product?.status === 'CRITICAL';
              const isLowAlert = notif.type === 'LOW_STOCK' || product?.status === 'LOW';
              const isStockAlert = notif.type === 'CRITICAL_STOCK' || notif.type === 'LOW_STOCK' || Boolean(product && (product.status === 'CRITICAL' || product.status === 'LOW'));

              return (
                <div 
                  key={notif.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isCriticalAlert ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-sidebar)',
                    border: `1px solid ${isCriticalAlert ? 'var(--status-critical-border)' : 'var(--border-color)'}`,
                    opacity: notif.read ? 0.75 : 1
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '260px' }}>
                    <div style={{ marginTop: '0.15rem' }}>
                      {isCriticalAlert ? (
                        <AlertOctagon size={22} style={{ color: 'var(--status-critical)' }} />
                      ) : isLowAlert ? (
                        <AlertTriangle size={22} style={{ color: 'var(--status-low)' }} />
                      ) : (
                        <Bell size={22} style={{ color: 'var(--primary-color)' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: isCriticalAlert ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {notif.message}
                      </div>

                      {product && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span>
                            Current Stock: <strong style={{ color: product.status === 'CRITICAL' ? 'var(--status-critical)' : product.status === 'LOW' ? 'var(--status-low)' : 'var(--status-normal)' }}>{product.quantity} {product.unit}</strong> ({product.status})
                          </span>
                          {product.supplierName && (
                            <span>Supplier: <strong style={{ color: 'var(--text-primary)' }}>{product.supplierName}</strong></span>
                          )}
                        </div>
                      )}

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                        {new Date(notif.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {/* Reorder Action Button */}
                    {product && (isStockAlert || product.status === 'CRITICAL' || product.status === 'LOW') && (
                      <button
                        onClick={() => handleOpenReorder(product.id)}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: (product.status === 'CRITICAL' || isCriticalAlert) ? 'var(--status-critical)' : 'var(--primary-color)',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          boxShadow: (product.status === 'CRITICAL' || isCriticalAlert) ? '0 2px 8px rgba(239, 68, 68, 0.3)' : '0 2px 8px rgba(99, 102, 241, 0.3)'
                        }}
                      >
                        <ShoppingCart size={15} />
                        <span>{(product.status === 'CRITICAL' || isCriticalAlert) ? 'Reorder Now' : 'Reorder'}</span>
                      </button>
                    )}

                    {product && product.status === 'NORMAL' && (
                      <span 
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--status-normal-bg)',
                          color: 'var(--status-normal)',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <PackageCheck size={13} />
                        Stock Restocked ({product.quantity} {product.unit})
                      </span>
                    )}

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
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Record Purchase Modal Integration */}
      <RecordPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        initialProductId={selectedReorderProductId}
      />
    </div>
  );
};
