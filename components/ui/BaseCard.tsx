'use client';

import React from 'react';
import { Card } from './Card';
import { Badge, type BadgeProps } from './Badge';

interface BaseCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  badge?: {
    label: string;
    color?: BadgeProps['color'];
  };
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export function BaseCard({
  children,
  header,
  footer,
  badge,
  onClick,
  className,
  hoverable = true,
}: BaseCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        hoverable ? 'hover:shadow-lg hover:scale-105' : ''
      } ${className || ''}`}
      onClick={onClick}
    >
      {/* Header with optional badge */}
      {(header || badge) && (
        <div className="mb-4 flex items-start justify-between gap-2">
          {header && <div className="flex-1">{header}</div>}
          {badge && <Badge color={badge.color}>{badge.label}</Badge>}
        </div>
      )}

      {/* Main content */}
      <div className="mb-4">{children}</div>

      {/* Footer */}
      {footer && <div className="border-t border-gray-100 pt-4">{footer}</div>}
    </Card>
  );
}
