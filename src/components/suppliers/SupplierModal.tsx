import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useShop } from '../../context/ShopContext';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addSupplier } = useShop();

  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [productsSuppliedText, setProductsSuppliedText] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const productsList = productsSuppliedText
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    addSupplier({
      name: name.trim(),
      contactNumber: contactNumber.trim(),
      email: email.trim(),
      address: address.trim(),
      productsSupplied: productsList.length > 0 ? productsList : ['General Shop Products'],
      status
    });

    // Reset form
    setName('');
    setContactNumber('');
    setEmail('');
    setAddress('');
    setProductsSuppliedText('');
    setStatus('ACTIVE');

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Wholesale Supplier Vendor"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary btn-sm">
            Save Supplier Record
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Supplier / Distributor Company Name *</label>
          <input
            type="text"
            required
            className="form-input"
            placeholder="e.g. Royal Spices & Dry Fruits Wholesalers"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Contact Phone Number *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="+91 98765 43210"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="contact@wholesaler.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Office / Warehouse Address</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. APMC Market Yard, Phase 2, Mumbai"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Products Supplied (Comma-separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Almonds, Cashews, Pistachios, Cardamom"
            value={productsSuppliedText}
            onChange={(e) => setProductsSuppliedText(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Vendor Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};
