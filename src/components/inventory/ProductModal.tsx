import React, { useState, useEffect } from 'react';
import type { Product, ProductCategory, UnitType } from '../../types';
import { Modal } from '../common/Modal';
import { useShop } from '../../context/ShopContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit
}) => {
  const { addProduct, updateProduct, suppliers } = useShop();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Dry Fruits');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<UnitType>('kg');
  const [purchasePrice, setPurchasePrice] = useState<number>(100);
  const [sellingPrice, setSellingPrice] = useState<number>(150);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(8);
  const [criticalStockThreshold, setCriticalStockThreshold] = useState<number>(3);
  const [supplierId, setSupplierId] = useState<string>('');

  const isEditMode = !!productToEdit;

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setDescription(productToEdit.description);
      setQuantity(productToEdit.quantity);
      setUnit(productToEdit.unit);
      setPurchasePrice(productToEdit.purchasePrice);
      setSellingPrice(productToEdit.sellingPrice);
      setLowStockThreshold(productToEdit.lowStockThreshold);
      setCriticalStockThreshold(productToEdit.criticalStockThreshold);
      setSupplierId(productToEdit.supplierId || '');
    } else {
      setName('');
      setCategory('Dry Fruits');
      setDescription('');
      setQuantity(10);
      setUnit('kg');
      setPurchasePrice(100);
      setSellingPrice(150);
      setLowStockThreshold(8);
      setCriticalStockThreshold(3);
      setSupplierId(suppliers.length > 0 ? suppliers[0].id : '');
    }
  }, [productToEdit, suppliers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const supplierObj = suppliers.find(s => s.id === supplierId);
    const supplierName = supplierObj ? supplierObj.name : 'General Supplier';

    if (isEditMode && productToEdit) {
      updateProduct({
        ...productToEdit,
        name: name.trim(),
        category,
        description: description.trim(),
        quantity: Number(quantity),
        unit,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        lowStockThreshold: Number(lowStockThreshold),
        criticalStockThreshold: Number(criticalStockThreshold),
        supplierId,
        supplierName
      });
    } else {
      addProduct({
        name: name.trim(),
        category,
        description: description.trim(),
        quantity: Number(quantity),
        unit,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        lowStockThreshold: Number(lowStockThreshold),
        criticalStockThreshold: Number(criticalStockThreshold),
        supplierId,
        supplierName
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Edit Product: ${productToEdit?.name}` : 'Add New Product'}
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary btn-sm">
            {isEditMode ? 'Save Changes' : 'Add Product'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            required
            className="form-input"
            placeholder="e.g. Kashmiri Almonds (Badam)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
            >
              <option value="Dry Fruits">Dry Fruits</option>
              <option value="Spices">Spices</option>
              <option value="Groceries">Groceries</option>
              <option value="Natural Sugars">Natural Sugars</option>
              <option value="Beverages">Beverages</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Unit Type</label>
            <select
              className="form-select"
              value={unit}
              onChange={(e) => setUnit(e.target.value as UnitType)}
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="g">Grams (g)</option>
              <option value="L">Liters (L)</option>
              <option value="ml">Milliliters (ml)</option>
              <option value="units">Units</option>
              <option value="packets">Packets</option>
              <option value="boxes">Boxes</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Description / Grade</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Whole King-size Kernels"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Stock Quantity</label>
            <input
              type="number"
              step="any"
              min="0"
              required
              className="form-input"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Cost Price (₹)</label>
            <input
              type="number"
              min="0"
              required
              className="form-input"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Selling Price (₹)</label>
            <input
              type="number"
              min="0"
              required
              className="form-input"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ color: 'var(--status-low)' }}>
              ⚠ Low-Stock Threshold
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              className="form-input"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ color: 'var(--status-critical)' }}>
              🚨 Critical Threshold
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              className="form-input"
              value={criticalStockThreshold}
              onChange={(e) => setCriticalStockThreshold(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Supplier / Distributor</label>
          <select
            className="form-select"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};
