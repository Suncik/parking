import React from 'react';
import { ParkingStatus } from '../../types';
import { STATUS_CONFIG } from '../../data/parkingData';

interface StatusBadgeProps {
  status: ParkingStatus;
  spotsCount?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  spotsCount,
  showText = true,
  size = 'md',
}) => {
  const config = STATUS_CONFIG[status];

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2.5 gap-1.5',
    md: 'text-xs font-semibold py-1 px-3 gap-2',
    lg: 'text-sm font-semibold py-1.5 px-3.5 gap-2.5',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border transition-colors ${config.bgClass} ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.badgeBg,
        borderColor: `${config.color}30`,
        color: config.color === '#EAB308' ? '#B45309' : config.color,
      }}
    >
      <span
        className={`rounded-full shrink-0 ${dotSizes[size]}`}
        style={{ backgroundColor: config.color }}
        aria-hidden="true"
      />
      {showText && (
        <span className="whitespace-nowrap">
          {config.label}
          {typeof spotsCount === 'number' && (
            <span className="ml-1 opacity-90 tabular-nums">
              ({spotsCount})
            </span>
          )}
        </span>
      )}
    </div>
  );
};
