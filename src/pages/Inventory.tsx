import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProductModal } from '../components/inventory/ProductModal';
import { StockAdjustModal } from '../components/inventory/StockAdjustModal';
import { Search, Plus, Edit2, Trash2, Sliders } from 'lucide-react';
import type { Product } from '../types';

export const Inventory: React.FC = () => {
  const { products, deleteProduct } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.supplierName && product.supplierName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setProductToEdit(p);
    setIsProductModalOpen(true);
  };

  const handleOpenAdjustModal = (p: Product) => {
    setProductToAdjust(p);
    setIsAdjustModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Inventory Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Real-time stock tracking with dynamic status computation
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search products by name, category, or supplier..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: '160px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Dry Fruits">Dry Fruits</option>
            <option value="Spices">Spices</option>
            <option value="Groceries">Groceries</option>
            <option value="Natural Sugars">Natural Sugars</option>
            <option value="Beverages">Beverages</option>
            <option value="Other">Other</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: '160px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="NORMAL">🟢 Normal Stock</option>
            <option value="LOW">🟡 Low Stock</option>
            <option value="CRITICAL">🔴 Critical Stock</option>
          </select>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Thresholds (Low / Critical)</th>
              <th>Purchase Price</th>
              <th>Selling Price</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                  No products found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.description || p.supplierName}</div>
                  </td>
                  <td>{p.category}</td>
                  <td style={{ fontWeight: 800 }}>
                    {p.quantity} {p.unit}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Low: {p.lowStockThreshold} {p.unit} | Crit: {p.criticalStockThreshold} {p.unit}
                  </td>
                  <td>₹{p.purchasePrice.toLocaleString('en-IN')}</td>
                  <td>₹{p.sellingPrice.toLocaleString('en-IN')}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button 
                        onClick={() => handleOpenAdjustModal(p)}
                        className="btn btn-secondary btn-sm"
                        title="Adjust Stock Quantity"
                      >
                        <Sliders size={14} />
                      </button>
                      <button 
                        onClick={() => handleOpenEditModal(p)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Product Details"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(p.id)}
                        className="btn btn-danger btn-sm"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Stock Adjust Modal */}
      <StockAdjustModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        product={productToAdjust}
      />
    </div>
  );
};
