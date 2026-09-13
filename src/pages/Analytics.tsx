import React, { useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  BarChart3, 
  TrendingUp, 
  IndianRupee, 
  ShoppingBag, 
  PieChart, 
  Layers, 
  Flame, 
  Snail, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { products, sales, purchases, inventoryValue, criticalStockCount, lowStockCount } = useShop();

  // 1. Calculate Total Revenue & Total Purchase Expenses
  const totalRevenue = useMemo(() => {
    return sales.reduce((acc, s) => acc + s.totalAmount, 0);
  }, [sales]);

  const totalPurchaseCosts = useMemo(() => {
    return purchases.reduce((acc, p) => acc + p.totalAmount, 0);
  }, [purchases]);

  // Estimated Net Profit = Sales Revenue - Purchase Expenses
  const estimatedProfit = totalRevenue - totalPurchaseCosts;
  const profitMarginPercent = totalRevenue > 0 ? ((estimatedProfit / totalRevenue) * 100).toFixed(1) : '0';

  // 2. Top-Selling Products by Revenue & Units
  const topSellingProducts = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; unit: string; totalRevenue: number }>();

    sales.forEach(s => {
      const existing = map.get(s.productId);
      if (existing) {
        existing.quantity += s.quantity;
        existing.totalRevenue += s.totalAmount;
      } else {
        map.set(s.productId, {
          name: s.productName,
          quantity: s.quantity,
          unit: s.unit,
          totalRevenue: s.totalAmount
        });
      }
    });

    return Array.from(map.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  }, [sales]);

  // 3. Fast-Moving vs Slow-Moving Products Analysis
  const soldProductIds = useMemo(() => new Set(sales.map(s => s.productId)), [sales]);

  const fastMovingProducts = useMemo(() => {
    return products.filter(p => soldProductIds.has(p.id)).slice(0, 5);
  }, [products, soldProductIds]);

  const slowMovingProducts = useMemo(() => {
    return products.filter(p => !soldProductIds.has(p.id) && p.quantity > 5).slice(0, 5);
  }, [products, soldProductIds]);

  // 4. Category Breakdown (Quantity & Valuation)
  const categoryStats = useMemo(() => {
    const map: Record<string, { quantity: number; value: number; count: number }> = {};

    products.forEach(p => {
      if (!map[p.category]) {
        map[p.category] = { quantity: 0, value: 0, count: 0 };
      }
      map[p.category].quantity += p.quantity;
      map[p.category].value += (p.quantity * p.sellingPrice);
      map[p.category].count += 1;
    });

    return map;
  }, [products]);

  // Max valuation category helper for relative progress bar widths
  const maxCategoryValuation = useMemo(() => {
    const values = Object.values(categoryStats).map(c => c.value);
    return Math.max(...values, 1);
  }, [categoryStats]);

  const normalStockCount = products.filter(p => p.status === 'NORMAL').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Title */}
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BarChart3 style={{ color: 'var(--accent-primary)' }} />
          Advanced Shop Analytics & Financial Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Real-time sales velocity, estimated profit margins, and stock distribution breakdown
        </p>
      </div>

      {/* Financial KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Inventory Valuation
            </span>
            <Layers size={20} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
            ₹{inventoryValue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            At current retail selling prices
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--status-normal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Revenue
            </span>
            <TrendingUp size={20} style={{ color: 'var(--status-normal)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-normal)', marginTop: '0.4rem' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            From {sales.length} customer sales transaction(s)
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stock Purchase Costs
            </span>
            <ShoppingBag size={20} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.4rem' }}>
            ₹{totalPurchaseCosts.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            From {purchases.length} stock replenishment order(s)
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--status-normal)', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estimated Profit Margin
            </span>
            <IndianRupee size={20} style={{ color: 'var(--status-normal)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: estimatedProfit >= 0 ? 'var(--status-normal)' : 'var(--status-critical)', marginTop: '0.4rem' }}>
            ₹{estimatedProfit.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontWeight: 600 }}>
            {profitMarginPercent}% Profit Margin (Revenue - Cost)
          </div>
        </div>

      </div>

      {/* Main Grid: Top Selling Products & Fast vs Slow Moving Goods */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Top-Selling Products by Revenue */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Flame size={20} style={{ color: '#f97316' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              Top-Selling Products (By Revenue)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topSellingProducts.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center', padding: '1.5rem' }}>
                No sales recorded yet to calculate top performers.
              </div>
            ) : (
              topSellingProducts.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(249, 115, 22, 0.15)',
                      color: '#f97316',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Sold: {item.quantity} {item.unit}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--status-normal)', fontSize: '0.95rem' }}>
                    ₹{item.totalRevenue.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fast-Moving vs Slow-Moving Items */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Snail size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              Inventory Velocity (Fast vs Slow Moving)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Fast Moving */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--status-normal)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ArrowUpRight size={15} />
                Fast-Moving (High Demand)
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {fastMovingProducts.map(p => (
                  <span key={p.id} style={{ padding: '0.3rem 0.65rem', backgroundColor: 'var(--status-normal-bg)', color: 'var(--status-normal)', border: '1px solid var(--status-normal-border)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600 }}>
                    ⚡ {p.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Slow Moving */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--status-low)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Snail size={15} />
                Slow-Moving (High Stock, Low Velocity)
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {slowMovingProducts.map(p => (
                  <span key={p.id} style={{ padding: '0.3rem 0.65rem', backgroundColor: 'var(--status-low-bg)', color: 'var(--status-low)', border: '1px solid var(--status-low-border)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600 }}>
                    🐢 {p.name} ({p.quantity} {p.unit})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Category Stock & Financial Valuation Breakdown */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PieChart size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              Category Valuation & Inventory Distribution
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Across {Object.keys(categoryStats).length} product categories
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {Object.entries(categoryStats).map(([categoryName, stats]) => {
            const percentage = ((stats.value / maxCategoryValuation) * 100).toFixed(0);
            return (
              <div key={categoryName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{categoryName}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '0.6rem' }}>
                      ({stats.count} products • {stats.quantity.toFixed(1)} units)
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ₹{stats.value.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ height: '10px', backgroundColor: 'var(--bg-sidebar)', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <div 
                    style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: 'var(--accent-gradient)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stock Health Status Distribution Bar */}
      <div className="card">
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} style={{ color: 'var(--status-low)' }} />
          Overall Stock Health Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-normal-bg)', border: '1px solid var(--status-normal-border)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--status-normal)', textTransform: 'uppercase' }}>🟢 NORMAL STOCK</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--status-normal)', marginTop: '0.2rem' }}>
              {normalStockCount} Products
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Sufficient quantity</div>
          </div>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-low-bg)', border: '1px solid var(--status-low-border)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--status-low)', textTransform: 'uppercase' }}>🟡 LOW STOCK</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--status-low)', marginTop: '0.2rem' }}>
              {lowStockCount} Products
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Near reorder threshold</div>
          </div>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-critical-bg)', border: '1px solid var(--status-critical-border)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--status-critical)', textTransform: 'uppercase' }}>🔴 CRITICAL STOCK</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--status-critical)', marginTop: '0.2rem' }}>
              {criticalStockCount} Products
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Requires urgent order</div>
          </div>
        </div>
      </div>

    </div>
  );
};
