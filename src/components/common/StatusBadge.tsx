import React from 'react';
import type { StockStatus } from '../../types';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatusBadgeProps {
  status: StockStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  if (status === 'CRITICAL') {
    return (
      <span className="status-badge critical">
        {showIcon && <AlertOctagon size={13} />}
        CRITICAL
      </span>
    );
  }

  if (status === 'LOW') {
    return (
      <span className="status-badge low">
        {showIcon && <AlertTriangle size={13} />}
        LOW
      </span>
    );
  }

  return (
    <span className="status-badge normal">
      {showIcon && <CheckCircle2 size={13} />}
      NORMAL
    </span>
  );
};
