import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useShop } from '../../context/ShopContext';
import { ShoppingBag, AlertCircle } from 'lucide-react';

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordSaleModal: React.FC<RecordSaleModalProps> = ({
  isOpen,
  onClose
}) => {
  const { products, recordSale } = useShop();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [saleQuantity, setSaleQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const totalAmount = selectedProduct ? (saleQuantity * selectedProduct.sellingPrice) : 0;
  const isStockInsufficient = selectedProduct ? (saleQuantity > selectedProduct.quantity) : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedProduct) return;
    if (isStockInsufficient) {
      setErrorMessage(`Cannot sell ${saleQuantity} ${selectedProduct.unit}. Available stock is only ${selectedProduct.quantity} ${selectedProduct.unit}.`);
      return;
    }

    const result = recordSale(selectedProductId, Number(saleQuantity));
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Customer Sale"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="btn btn-primary btn-sm"
            disabled={isStockInsufficient || !selectedProduct}
            style={{ opacity: isStockInsufficient ? 0.5 : 1 }}
          >
            Confirm & Save Sale
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {errorMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--status-critical-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--status-critical)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Select Product *</label>
          <select
            className="form-select"
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setErrorMessage(null);
            }}
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — Current Stock: {p.quantity} {p.unit} (₹{p.sellingPrice}/{p.unit})
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-sidebar)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Product Info & Stock</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {selectedProduct.name} ({selectedProduct.category})
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available Quantity</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isStockInsufficient ? 'var(--status-critical)' : 'var(--status-normal)' }}>
                {selectedProduct.quantity} {selectedProduct.unit}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Sale Quantity ({selectedProduct?.unit || 'units'}) *</label>
            <input
              type="number"
              step="any"
              min="0.1"
              required
              className="form-input"
              value={saleQuantity}
              onChange={(e) => {
                setSaleQuantity(Number(e.target.value));
                setErrorMessage(null);
              }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Unit Price (₹)</label>
            <input
              type="number"
              readOnly
              className="form-input"
              style={{ opacity: 0.75, cursor: 'not-allowed' }}
              value={selectedProduct?.sellingPrice || 0}
            />
          </div>
        </div>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid var(--status-normal-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--status-normal)' }}>
            <ShoppingBag size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Calculated Total Amount</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-normal)' }}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
        </div>

      </form>
    </Modal>
  );
};
