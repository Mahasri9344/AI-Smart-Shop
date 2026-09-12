import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useShop } from '../../context/ShopContext';
import { Truck } from 'lucide-react';

interface RecordPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
}

export const RecordPurchaseModal: React.FC<RecordPurchaseModalProps> = ({
  isOpen,
  onClose,
  initialProductId
}) => {
  const { products, suppliers, recordPurchase } = useShop();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(10);
  const [unitPrice, setUnitPrice] = useState<number>(100);

  useEffect(() => {
    if (isOpen) {
      const targetProdId = (initialProductId && products.some(p => p.id === initialProductId))
        ? initialProductId
        : (products.length > 0 ? products[0].id : '');

      setSelectedProductId(targetProdId);

      const prod = products.find(p => p.id === targetProdId);
      if (prod) {
        setUnitPrice(prod.purchasePrice);
        if (prod.supplierId && suppliers.some(s => s.id === prod.supplierId)) {
          setSelectedSupplierId(prod.supplierId);
        } else if (suppliers.length > 0) {
          setSelectedSupplierId(suppliers[0].id);
        }
      }
    }
  }, [isOpen, initialProductId, products, suppliers]);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setUnitPrice(prod.purchasePrice);
      if (prod.supplierId && suppliers.some(s => s.id === prod.supplierId)) {
        setSelectedSupplierId(prod.supplierId);
      }
    }
  };

  const totalAmount = purchaseQuantity * unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || purchaseQuantity <= 0) return;

    recordPurchase(
      selectedProductId,
      Number(purchaseQuantity),
      Number(unitPrice),
      selectedSupplierId
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Purchase Order (Stock Replenishment)"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary btn-sm">
            Confirm & Increment Stock
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Select Product to Restock *</label>
          <select
            className="form-select"
            value={selectedProductId}
            onChange={(e) => handleProductChange(e.target.value)}
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — Current Stock: {p.quantity} {p.unit} ({p.status})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Select Wholesale Supplier *</label>
          <select
            className="form-select"
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Purchase Quantity ({selectedProduct?.unit || 'units'}) *</label>
            <input
              type="number"
              step="any"
              min="0.1"
              required
              className="form-input"
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Unit Cost Price (₹) *</label>
            <input
              type="number"
              min="0"
              required
              className="form-input"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#8b5cf6' }}>
            <Truck size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Total Order Purchase Cost</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6' }}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
        </div>

        {selectedProduct && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            After purchase, stock of <strong style={{ color: 'var(--text-primary)' }}>{selectedProduct.name}</strong> will increase to{' '}
            <strong style={{ color: 'var(--status-normal)' }}>
              {selectedProduct.quantity + Number(purchaseQuantity)} {selectedProduct.unit}
            </strong>.
          </div>
        )}

      </form>
    </Modal>
  );
};
