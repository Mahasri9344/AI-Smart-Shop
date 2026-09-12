import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { RecordSaleModal } from '../components/sales/RecordSaleModal';
import { Plus, TrendingUp } from 'lucide-react';

export const Sales: React.FC = () => {
  const { sales, todaySalesAmount } = useShop();
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Sales Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Record customer sales with automatic stock deduction & revenue tracking
          </p>
        </div>

        <button onClick={() => setIsSaleModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Record New Sale</span>
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <TrendingUp size={24} style={{ color: 'var(--status-normal)' }} />
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Today's Total Sales</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{todaySalesAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No sales recorded yet. Click "Record New Sale" to add your first transaction.
                  </td>
                </tr>
              ) : (
                sales.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.id}</td>
                    <td style={{ fontWeight: 600 }}>{s.productName}</td>
                    <td>{s.quantity} {s.unit}</td>
                    <td>₹{s.unitPrice.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 800, color: 'var(--status-normal)' }}>
                      ₹{s.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {new Date(s.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RecordSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />
    </div>
  );
};
