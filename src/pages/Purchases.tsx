import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { RecordPurchaseModal } from '../components/purchases/RecordPurchaseModal';
import { Truck, Plus } from 'lucide-react';

export const Purchases: React.FC = () => {
  const { purchases, todayPurchasesAmount } = useShop();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Purchase Management (Stock-In)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Record supplier purchases with automatic inventory replenishment
          </p>
        </div>

        <button onClick={() => setIsPurchaseModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Record New Purchase</span>
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <Truck size={24} style={{ color: '#8b5cf6' }} />
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Today's Total Purchases</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{todayPurchasesAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Purchase ID</th>
                <th>Product</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Cost Price</th>
                <th>Total Cost</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No purchases recorded yet. Click "Record New Purchase" to add stock replenishment.
                  </td>
                </tr>
              ) : (
                purchases.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.id}</td>
                    <td style={{ fontWeight: 600 }}>{p.productName}</td>
                    <td>{p.supplierName}</td>
                    <td>{p.quantity} {p.unit}</td>
                    <td>₹{p.unitPrice.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 800 }}>
                      ₹{p.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {new Date(p.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RecordPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
};
