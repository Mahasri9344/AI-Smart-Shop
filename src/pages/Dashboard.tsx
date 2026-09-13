import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProductModal } from '../components/inventory/ProductModal';
import { RecordSaleModal } from '../components/sales/RecordSaleModal';
import { RecordPurchaseModal } from '../components/purchases/RecordPurchaseModal';
import { 
  Package, 
  Layers, 
  IndianRupee, 
  AlertTriangle, 
  AlertOctagon, 
  TrendingUp, 
  ShoppingBag, 
  Plus, 
  Bot, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { 
    products, 
    totalProducts, 
    totalStockUnits, 
    inventoryValue, 
    lowStockCount, 
    criticalStockCount, 
    todaySalesAmount, 
    todayPurchasesAmount,
    sales,
    notifications,
    resetToSampleData
  } = useShop();

  const navigate = useNavigate();

  // Modal States for Quick Actions
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // Filter products by critical and low status for widgets
  const criticalProducts = products.filter(p => p.status === 'CRITICAL');
  const lowProducts = products.filter(p => p.status === 'LOW');
  const recentSales = sales.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Page Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Smart Shopkeeper Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Real-time stock status, proactive critical alerts & intelligent assistant
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={resetToSampleData} 
            className="btn btn-secondary btn-sm"
            title="Reset sample inventory"
          >
            <RefreshCw size={14} />
            <span>Reset Demo Data</span>
          </button>

          <button 
            onClick={() => navigate('/ai-assistant')} 
            className="btn btn-primary btn-sm"
          >
            <Bot size={16} />
            <span>Open AI Voice Assistant</span>
          </button>
        </div>
      </div>

      {/* Proactive Critical Stock Alert Banner (Triggered automatically when critical stock exists) */}
      {criticalProducts.length > 0 && (
        <div className="critical-banner">
          <div className="banner-content">
            <div className="banner-icon">
              <AlertOctagon size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--status-critical)', fontSize: '1.05rem' }}>
                🚨 PROACTIVE ALERT: {criticalProducts.length} CRITICAL STOCK ITEM(S) DETECTED
              </div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                {criticalProducts.map(p => `${p.name} (${p.quantity} ${p.unit} left, critical threshold: ${p.criticalStockThreshold} ${p.unit})`).join(' • ')}
              </div>
            </div>
          </div>
          <Link to="/inventory?status=CRITICAL" className="btn btn-danger btn-sm">
            Restock Now
          </Link>
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ Quick Actions
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setIsAddProductModalOpen(true)} className="btn btn-secondary btn-sm">
              <Plus size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>Add Product</span>
            </button>
            <button onClick={() => setIsSaleModalOpen(true)} className="btn btn-secondary btn-sm">
              <ArrowUpRight size={16} style={{ color: 'var(--status-normal)' }} />
              <span>Record Sale</span>
            </button>
            <button onClick={() => setIsPurchaseModalOpen(true)} className="btn btn-secondary btn-sm">
              <ArrowDownRight size={16} style={{ color: 'var(--status-low)' }} />
              <span>Record Purchase</span>
            </button>
            <Link to="/ai-assistant" className="btn btn-primary btn-sm">
              <Sparkles size={16} />
              <span>Ask AI Smart Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Performance Indicator (KPI) Grid */}
      <div className="grid-stats">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package size={24} style={{ color: 'var(--accent-primary)' }} />}
          subtitle="Across 6 Categories"
        />

        <StatCard
          title="Total Stock Units"
          value={`${totalStockUnits.toFixed(1)} units`}
          icon={<Layers size={24} style={{ color: '#3b82f6' }} />}
          subtitle="Live Physical Quantity"
        />

        <StatCard
          title="Inventory Valuation"
          value={`₹${inventoryValue.toLocaleString('en-IN')}`}
          icon={<IndianRupee size={24} style={{ color: '#10b981' }} />}
          subtitle="At Current Selling Price"
        />

        <StatCard
          title="Low Stock"
          value={lowStockCount}
          borderVariant={lowStockCount > 0 ? 'low' : 'default'}
          icon={<AlertTriangle size={24} style={{ color: 'var(--status-low)' }} />}
          subtitle="Approaching Reorder Level"
        />

        <StatCard
          title="Critical Stock"
          value={criticalStockCount}
          borderVariant={criticalStockCount > 0 ? 'critical' : 'success'}
          icon={<AlertOctagon size={24} style={{ color: 'var(--status-critical)' }} />}
          subtitle="Immediate Action Required"
        />

        <StatCard
          title="Today's Sales"
          value={`₹${todaySalesAmount.toLocaleString('en-IN')}`}
          icon={<TrendingUp size={24} style={{ color: 'var(--status-normal)' }} />}
          subtitle="Real-time Revenue"
        />

        <StatCard
          title="Today's Purchases"
          value={`₹${todayPurchasesAmount.toLocaleString('en-IN')}`}
          icon={<ShoppingBag size={24} style={{ color: '#8b5cf6' }} />}
          subtitle="Stock Replenishment"
        />
      </div>

      {/* Main Dashboard Layout: Inventory Overview + AI Insights Sidebar */}
      <div className="grid-dashboard-main">
        
        {/* Left Column: Critical & Low Stock Products Table Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertTriangle size={20} style={{ color: 'var(--status-critical)' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                  Stock Attention Required ({criticalProducts.length + lowProducts.length})
                </h3>
              </div>
              <Link to="/inventory" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                View All Inventory →
              </Link>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock Quantity</th>
                    <th>Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...criticalProducts, ...lowProducts].length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        🎉 All inventory stock levels are healthy (NORMAL).
                      </td>
                    </tr>
                  ) : (
                    [...criticalProducts, ...lowProducts].map(product => (
                      <tr key={product.id}>
                        <td style={{ fontWeight: 600 }}>{product.name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{product.category}</td>
                        <td style={{ fontWeight: 700 }}>
                          {product.quantity} {product.unit}
                        </td>
                        <td>₹{(product.quantity * product.sellingPrice).toLocaleString('en-IN')}</td>
                        <td>
                          <StatusBadge status={product.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Today's Recent Sales Activity */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                Recent Sales Transactions
              </h3>
              <Link to="/sales" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                View Sales History →
              </Link>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Sale ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
                        No sales recorded yet today. Click "Record Sale" to add your first transaction.
                      </td>
                    </tr>
                  ) : (
                    recentSales.map(sale => (
                      <tr key={sale.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {sale.id}
                        </td>
                        <td style={{ fontWeight: 600 }}>{sale.productName}</td>
                        <td>{sale.quantity} {sale.unit}</td>
                        <td style={{ fontWeight: 700, color: 'var(--status-normal)' }}>
                          ₹{sale.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: AI Assistant Preview & Realtime Alerts Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* AI Assistant Quick Interface */}
          <div className="card" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDFA 100%)', borderColor: '#CCFBF1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Bot size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>AI SMART ASSISTANT</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Natural language & voice stock query
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: '#F0FDFA',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid #CCFBF1',
              marginBottom: '1rem',
              fontSize: '0.88rem'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--accent-primary)' }}>
                🤖 Quick Stock Insights:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>{criticalStockCount} items need immediate restocking.</li>
                <li>{lowStockCount} items are near low threshold.</li>
                <li>{totalProducts} products tracked dynamically.</li>
              </ul>
            </div>

            <Link to="/ai-assistant" className="btn btn-primary" style={{ width: '100%' }}>
              <Bot size={18} />
              <span>Launch Voice & AI Chat</span>
            </Link>
          </div>

          {/* Notifications & Recent Alerts Stream */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                Live Proactive Alerts
              </h4>
              <Link to="/alerts" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                View All ({notifications.length})
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.slice(0, 4).map(notif => (
                <div 
                  key={notif.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: notif.type === 'CRITICAL_STOCK' ? '#FEF2F2' : '#F8FAFC',
                    border: `1px solid ${notif.type === 'CRITICAL_STOCK' ? '#FCA5A5' : 'var(--border-color)'}`
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: notif.type === 'CRITICAL_STOCK' ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                    {notif.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Modals connected to Quick Actions */}
      <ProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
      />

      <RecordSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />

      <RecordPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />

    </div>
  );
};
