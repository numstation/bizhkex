import React from 'react';
import { Tag } from 'lucide-react';

interface PromotionBadgeProps {
  isPromoted?: boolean;
  discountPercentage?: number;
  className?: string;
}

export function PromotionBadge({
  isPromoted = false,
  discountPercentage = 0,
  className = '',
}: PromotionBadgeProps) {
  if (!isPromoted && !discountPercentage) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold ${className}`}>
      <Tag size={14} />
      {discountPercentage > 0 ? `-${discountPercentage}%` : 'Featured'}
    </div>
  );
}
