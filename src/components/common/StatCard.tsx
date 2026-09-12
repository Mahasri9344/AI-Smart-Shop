import React, { type ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  borderVariant?: 'default' | 'critical' | 'low' | 'success';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  borderVariant = 'default',
  subtitle
}) => {
  const getBorderClass = () => {
    switch (borderVariant) {
      case 'critical': return 'critical-border';
      case 'low': return 'low-border';
      case 'success': return 'success-border';
      default: return '';
    }
  };

  return (
    <div className={`stat-card ${getBorderClass()}`}>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {subtitle}
          </div>
        )}
      </div>
      <div className="stat-icon-wrapper">
        {icon}
      </div>
    </div>
  );
};
