import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { Modal } from '../common/Modal';
import { useShop } from '../../context/ShopContext';
import { Plus, Minus } from 'lucide-react';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { adjustStock } = useShop();
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(1);
  const [mode, setMode] = useState<'ADD' | 'SUBTRACT'>('ADD');

  useEffect(() => {
    setAdjustmentAmount(1);
    setMode('ADD');
  }, [product]);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const delta = mode === 'ADD' ? Number(adjustmentAmount) : -Number(adjustmentAmount);
    adjustStock(product.id, delta);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Quick Stock Adjust: ${product.name}`}
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary btn-sm">
            Apply Stock Update
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Stock Level</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {product.quantity} {product.unit}
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Adjustment Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              className={`btn ${mode === 'ADD' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMode('ADD')}
            >
              <Plus size={16} />
              <span>Add Stock (+)</span>
            </button>
            <button
              type="button"
              className={`btn ${mode === 'SUBTRACT' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setMode('SUBTRACT')}
            >
              <Minus size={16} />
              <span>Reduce Stock (-)</span>
            </button>
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Quantity Adjustment ({product.unit})</label>
          <input
            type="number"
            step="any"
            min="0.1"
            required
            className="form-input"
            value={adjustmentAmount}
            onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
          />
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          New computed stock will be:{' '}
          <strong style={{ color: 'var(--accent-primary)' }}>
            {Math.max(0, mode === 'ADD' ? product.quantity + Number(adjustmentAmount) : product.quantity - Number(adjustmentAmount))} {product.unit}
          </strong>
        </div>
      </form>
    </Modal>
  );
};
