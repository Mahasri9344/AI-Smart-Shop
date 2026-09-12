import React from 'react';
import { useShop } from '../context/ShopContext';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export const Profile: React.FC = () => {
  const { userProfile } = useShop();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          User Profile & Credentials
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Shopkeeper account information and role permissions
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.5rem'
          }}>
            <User size={32} />
          </div>

          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{userProfile.name}</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{userProfile.role}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={18} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</div>
              <div style={{ fontWeight: 600 }}>{userProfile.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Phone size={18} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Number</div>
              <div style={{ fontWeight: 600 }}>{userProfile.phone}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin size={18} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Store Address</div>
              <div style={{ fontWeight: 600 }}>{userProfile.address}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
