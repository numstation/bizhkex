import React from 'react';
import { Check } from 'lucide-react';

interface PricingPackage {
  id: number;
  deskType: 'private_office' | 'dedicated_desk' | 'hot_desk' | 'virtual_office';
  name: string;
  price: number | string;
  billingCycle?: string | null;
}

interface DeskTypePricingProps {
  packages: PricingPackage[];
  className?: string;
}

const deskTypeLabels: Record<string, string> = {
  private_office: 'Private Office',
  dedicated_desk: 'Dedicated Desk',
  hot_desk: 'Hot Desk',
  virtual_office: 'Virtual Office',
};

export function DeskTypePricing({ packages, className = '' }: DeskTypePricingProps) {
  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-headline">Pricing Options</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th>Workspace Type</th>
              <th>Plan</th>
              <th className="text-right">Price</th>
              <th>Billing</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td className="font-medium text-gray-900">
                  {deskTypeLabels[pkg.deskType] || pkg.deskType}
                </td>
                <td className="text-gray-600">
                  {pkg.name && pkg.name !== deskTypeLabels[pkg.deskType]
                    ? pkg.name
                    : '—'}
                </td>
                <td className="text-right font-semibold text-emerald-700">
                  HK${typeof pkg.price === 'string'
                    ? pkg.price
                    : Number(pkg.price).toLocaleString()}
                </td>
                <td className="text-gray-500 capitalize">
                  per {pkg.billingCycle || 'month'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AmenityList({ amenities }: { amenities: string[] }) {
  if (!amenities.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
      {amenities.map((amenity, idx) => (
        <div key={idx} className="flex items-center gap-3 text-gray-700">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-600" />
          </span>
          <span className="text-sm">{amenity}</span>
        </div>
      ))}
    </div>
  );
}
