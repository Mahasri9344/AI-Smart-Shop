import React from 'react';
import { useShop } from '../context/ShopContext';
export const Analytics: React.FC = () => {
  const { products, inventoryValue, todaySalesAmount, criticalStockCount, lowStockCount } = useShop();

  const categoryBreakdown = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Shop Analytics & Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Revenue trends, stock movement metrics and category distribution
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Shop Inventory Value</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-normal)', marginTop: '0.3rem' }}>
            ₹{inventoryValue.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.3rem' }}>
            ₹{todaySalesAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock Health Risk</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-critical)', marginTop: '0.3rem' }}>
            {criticalStockCount} Critical / {lowStockCount} Low
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700 }}>
          Category Stock Distribution (Units)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {Object.entries(categoryBreakdown).map(([cat, totalQty]) => (
            <div key={cat}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600 }}>{cat}</span>
                <span style={{ fontWeight: 700 }}>{totalQty.toFixed(1)} units</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalQty / 100) * 100)}%`, height: '100%', background: 'var(--accent-gradient)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
