import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MapPin, DollarSign, Star, Users } from "lucide-react";

interface Office {
  id: number;
  name: string;
  address: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  thumbnailUrl?: string;
}

interface LocationComparisonProps {
  office1: Office;
  office2: Office;
  onClose: () => void;
}

export function LocationComparison({
  office1,
  office2,
  onClose,
}: LocationComparisonProps) {
  const comparisonQuery = trpc.knowledge.getLocationComparison.useQuery(
    {
      officeId1: office1.id,
      officeId2: office2.id,
    },
    { enabled: !!office1 && !!office2 }
  );

  const comparisonData = comparisonQuery.data;

  const rows = [
    {
      label: "Monthly Price",
      icon: <DollarSign size={16} className="text-emerald-600" />,
      value1: `HK$${office1.basePrice.toLocaleString()}`,
      value2: `HK$${office2.basePrice.toLocaleString()}`,
    },
    {
      label: "Rating",
      icon: <Star size={16} className="text-amber-500" />,
      value1: `${office1.rating} (${office1.reviewCount} reviews)`,
      value2: `${office2.rating} (${office2.reviewCount} reviews)`,
    },
    {
      label: "Capacity",
      icon: <Users size={16} className="text-emerald-600" />,
      value1: `${office1.capacity} desks`,
      value2: `${office2.capacity} desks`,
    },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-xl border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Location Comparison</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-900">
          <X size={20} />
        </Button>
      </div>

      {comparisonData && (
        <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <h3 className="font-semibold text-emerald-900">{comparisonData.title}</h3>
          {comparisonData.description && (
            <p className="text-emerald-800/80 mt-1 text-sm">{comparisonData.description}</p>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-1/4">Metric</th>
              <th className="text-center">{office1.name}</th>
              <th className="text-center">{office2.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium text-gray-500">Address</td>
              <td className="text-center text-sm text-gray-600">
                <span className="inline-flex items-center gap-1 justify-center">
                  <MapPin size={14} className="text-emerald-600 flex-shrink-0" />
                  {office1.address}
                </span>
              </td>
              <td className="text-center text-sm text-gray-600">
                <span className="inline-flex items-center gap-1 justify-center">
                  <MapPin size={14} className="text-emerald-600 flex-shrink-0" />
                  {office2.address}
                </span>
              </td>
            </tr>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="font-medium text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    {row.icon}
                    {row.label}
                  </span>
                </td>
                <td className="text-center font-medium text-gray-900">{row.value1}</td>
                <td className="text-center font-medium text-gray-900">{row.value2}</td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="font-semibold text-gray-700">Price Difference</td>
              <td className="text-center">
                <span
                  className={`font-semibold ${
                    office1.basePrice < office2.basePrice ? "text-emerald-600" : "text-gray-500"
                  }`}
                >
                  {office1.basePrice < office2.basePrice ? "Lower" : "Higher"} by HK$
                  {Math.abs(office1.basePrice - office2.basePrice).toLocaleString()}
                </span>
              </td>
              <td className="text-center">
                <span
                  className={`font-semibold ${
                    office2.basePrice < office1.basePrice ? "text-emerald-600" : "text-gray-500"
                  }`}
                >
                  {office2.basePrice < office1.basePrice ? "Lower" : "Higher"} by HK$
                  {Math.abs(office2.basePrice - office1.basePrice).toLocaleString()}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {comparisonData && (
        <div className="mt-4 text-center text-xs text-gray-400">
          Viewed {comparisonData.viewCount} times
        </div>
      )}
    </Card>
  );
}
