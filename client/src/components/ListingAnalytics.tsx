import { Card } from "@/components/ui/card";
import { Eye, MessageSquare, TrendingUp } from "lucide-react";

interface ListingAnalyticsProps {
  officeName: string;
  views: number;
  inquiries: number;
}

export default function ListingAnalytics({ officeName, views, inquiries }: ListingAnalyticsProps) {
  const conversionRate = views > 0 ? Math.round((inquiries / views) * 100 * 100) / 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total Views</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{views}</p>
          </div>
          <Eye className="w-8 h-8 text-blue-400" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Total Inquiries</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{inquiries}</p>
          </div>
          <MessageSquare className="w-8 h-8 text-green-400" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium">Conversion Rate</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">{conversionRate}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-400" />
        </div>
      </Card>
    </div>
  );
}
