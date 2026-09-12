import React from 'react';
import { useShop } from '../context/ShopContext';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const { userProfile } = useShop();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Shop Settings & Preferences
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Configure shop details, alert thresholds, voice & AI settings
        </p>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: 700 }}>
          Store Profile & Currency Settings
        </h3>

        <div className="form-group">
          <label className="form-label">Shop Name</label>
          <input type="text" className="form-input" defaultValue={userProfile.shopName} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Currency Symbol</label>
            <input type="text" className="form-input" defaultValue="₹ (INR)" />
          </div>
          <div className="form-group">
            <label className="form-label">Default Unit</label>
            <select className="form-select" defaultValue="kg">
              <option value="kg">Kilograms (kg)</option>
              <option value="g">Grams (g)</option>
              <option value="packets">Packets</option>
              <option value="boxes">Boxes</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          <Save size={16} />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};
