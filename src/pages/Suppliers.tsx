import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SupplierModal } from '../components/suppliers/SupplierModal';
import { Phone, Mail, MapPin, Plus, Package } from 'lucide-react';

export const Suppliers: React.FC = () => {
  const { suppliers } = useShop();
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Supplier Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Wholesale vendors, contact details and stock order history
          </p>
        </div>

        <button onClick={() => setIsSupplierModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Supplier</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {suppliers.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No suppliers found. Click "Add New Supplier" to create your first vendor record.
          </div>
        ) : (
          suppliers.map(sup => (
            <div key={sup.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  {sup.name}
                </div>
                <span className={`status-badge ${sup.status === 'ACTIVE' ? 'normal' : 'low'}`}>
                  {sup.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} style={{ color: 'var(--accent-primary)' }} />
                  <span>{sup.contactNumber}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} style={{ color: 'var(--accent-primary)' }} />
                  <span>{sup.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
                  <span>{sup.address}</span>
                </div>
              </div>

              {sup.productsSupplied && sup.productsSupplied.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Package size={13} />
                    <span>Products Supplied:</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {sup.productsSupplied.map((p, idx) => (
                      <span key={idx} style={{
                        padding: '0.15rem 0.45rem',
                        backgroundColor: 'var(--bg-sidebar)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.75rem'
                      }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Purchases: <strong style={{ color: 'var(--text-primary)' }}>₹{sup.totalPurchases.toLocaleString('en-IN')}</strong></span>
                <span>Last: {sup.lastPurchaseDate}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
      />
    </div>
  );
};
