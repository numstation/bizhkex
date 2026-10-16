import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Edit, Trash2, Eye, MessageSquare, TrendingUp, Users, FileText, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import CreateListingForm from "@/components/CreateListingForm";
import InquiryDetailModal from "@/components/InquiryDetailModal";
import ListingAnalytics from "@/components/ListingAnalytics";

export default function ProviderDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "inquiries">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Redirect if not authenticated or not a provider
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "provider")) {
      navigate("/provider");
    }
  }, [user, authLoading, navigate]);

  // Fetch provider data (only when authenticated as provider)
  const isProvider = !authLoading && user && user.role === 'provider';
  const { data: providerData, isLoading: providerLoading } = trpc.provider.getProviderInfo.useQuery(undefined, { enabled: Boolean(isProvider) });
  const { data: listings, isLoading: listingsLoading } = trpc.provider.getListings.useQuery(undefined, { enabled: Boolean(isProvider) });
  const { data: analyticsSummary, isLoading: analyticsSummaryLoading } = trpc.provider.getAnalyticsSummary.useQuery(undefined, { enabled: Boolean(isProvider) });
  const { data: analytics, isLoading: analyticsLoading } = trpc.provider.getAnalytics.useQuery(undefined, { enabled: Boolean(isProvider) });
  const { data: inquiries, isLoading: inquiriesLoading } = trpc.provider.getInquiries.useQuery({}, { enabled: Boolean(isProvider) });

  // Mutations
  const deleteListing = trpc.provider.deleteListing.useMutation({
    onSuccess: () => {
      toast.success("Listing deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete listing");
    },
  });

  const updateInquiryStatus = trpc.provider.updateInquiryStatus.useMutation({
    onSuccess: () => {
      toast.success("Inquiry status updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update inquiry");
    },
  });

  if (authLoading || providerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "provider") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting…</p>
        </div>
      </div>
    );
  }

  const filteredListings = listings?.filter(office =>
    office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredInquiries = inquiries?.filter((inquiry: any) =>
    inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Analytics data for charts with date filtering
  const allChartData = [
    { date: "2024-01-01", month: "Jan", views: 400, clicks: 240, inquiries: 24 },
    { date: "2024-02-01", month: "Feb", views: 300, clicks: 139, inquiries: 22 },
    { date: "2024-03-01", month: "Mar", views: 200, clicks: 98, inquiries: 29 },
    { date: "2024-04-01", month: "Apr", views: 278, clicks: 39, inquiries: 20 },
    { date: "2024-05-01", month: "May", views: 189, clicks: 48, inquiries: 21 },
    { date: "2024-06-01", month: "Jun", views: 239, clicks: 75, inquiries: 25 },
    { date: "2024-07-01", month: "Jul", views: 350, clicks: 180, inquiries: 28 },
    { date: "2024-08-01", month: "Aug", views: 420, clicks: 210, inquiries: 31 },
    { date: "2024-09-01", month: "Sep", views: 380, clicks: 195, inquiries: 26 },
    { date: "2024-10-01", month: "Oct", views: 450, clicks: 250, inquiries: 35 },
    { date: "2024-11-01", month: "Nov", views: 500, clicks: 290, inquiries: 38 },
    { date: "2024-12-01", month: "Dec", views: 550, clicks: 320, inquiries: 42 },
  ];

  const chartData = allChartData.filter(item => {
    const itemDate = new Date(item.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return itemDate >= startDate && itemDate <= endDate;
  });

  const inquiryStatusData = [
    { name: "New", value: inquiries?.filter((i: any) => i.status === "new").length || 0, color: "#3b82f6" },
    { name: "Contacted", value: inquiries?.filter((i: any) => i.status === "contacted").length || 0, color: "#f59e0b" },
    { name: "Resolved", value: inquiries?.filter((i: any) => i.status === "resolved").length || 0, color: "#10b981" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-gray-900">業主儀表板</h1>
              <p className="text-gray-600 mt-1">{providerData?.name}</p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold" onClick={() => navigate("/provider-signup")}>
                新增盤源
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                返回首頁
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-2 border-b-2 font-bold transition-colors ${
                activeTab === "overview"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              概覽
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`py-4 px-2 border-b-2 font-bold transition-colors ${
                activeTab === "listings"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              🏢 現正刊登盤源 ({listings?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`py-4 px-2 border-b-2 font-bold transition-colors ${
                activeTab === "inquiries"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              📈 累計客戶詢盤 ({inquiries?.length || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">🏢 現正刊登盤源</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{listings?.length || 0}</p>
                  </div>
                  <FileText className="w-10 h-10 text-blue-600" />
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">📈 累計客戶詢盤</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{inquiries?.length || 0}</p>
                  </div>
                  <MessageSquare className="w-10 h-10 text-green-600" />
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">👁️ 月度瀏覽量</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{analyticsSummary?.monthlyViews || 0}</p>
                  </div>
                  <Eye className="w-10 h-10 text-purple-600" />
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-orange-600 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">⚡ 睇樓轉換率</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{analyticsSummary?.conversionRate || 0}%</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-orange-600" />
                </div>
              </Card>
            </div>

            {/* Date Range Filter */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="flex-1"></div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() => {
                      setDateRange({
                        start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0],
                      });
                    }}
                    variant="outline"
                    className="text-sm"
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    onClick={() => {
                      setDateRange({
                        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0],
                      });
                    }}
                    variant="outline"
                    className="text-sm"
                  >
                    Last 30 Days
                  </Button>
                  <Button
                    onClick={() => {
                      setDateRange({
                        start: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0],
                      });
                    }}
                    variant="outline"
                    className="text-sm"
                  >
                    Last 3 Months
                  </Button>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-bold text-black mb-4">Monthly Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="clicks" stroke="#f59e0b" />
                    <Line type="monotone" dataKey="inquiries" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-black mb-4">Inquiry Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={inquiryStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inquiryStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => setShowCreateForm(true)} className="bg-red-600 hover:bg-red-700">
                <Plus size={18} className="mr-2" /> Add New Listing
              </Button>
            </div>

            {listingsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading listings...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No listings found</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredListings.map((office) => {
                  const officeAnalytics = analytics?.find((a: any) => a.officeId === office.id);
                  const views = officeAnalytics?.views || 0;
                  const inquiries = officeAnalytics?.inquiries || 0;
                  
                  return (
                  <Card key={office.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-black">{office.name}</h3>
                        <p className="text-gray-600 mt-1">{office.address}</p>
                        
                        {/* Analytics for this listing */}
                        <div className="mt-4 mb-4">
                          <ListingAnalytics officeName={office.name} views={views} inquiries={inquiries} />
                        </div>
                        
                        <div className="flex gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-600">Base Price</p>
                            <p className="text-lg font-semibold text-black">HK${office.basePrice}/mo</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Rating</p>
                            <p className="text-lg font-semibold text-black">{office.rating} ⭐</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Reviews</p>
                            <p className="text-lg font-semibold text-black">{office.reviewCount}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/offices/${office.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingListing(office);
                            setShowCreateForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this listing?")) {
                              deleteListing.mutate({ officeId: office.id });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            {inquiriesLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading inquiries...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No inquiries found</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredInquiries.map((inquiry: any) => (
                  <Card key={inquiry.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-black">{inquiry.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            inquiry.status === "new" ? "bg-blue-100 text-blue-800" :
                            inquiry.status === "contacted" ? "bg-yellow-100 text-yellow-800" :
                            inquiry.status === "resolved" ? "bg-green-100 text-green-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {inquiry.status ? inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1) : "New"}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{inquiry.email} • {inquiry.phone}</p>
                        <p className="text-gray-600 mt-1">Company: {inquiry.company || "N/A"}</p>
                        <p className="text-gray-700 mt-3">{inquiry.message}</p>
                        <p className="text-sm text-gray-500 mt-3">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setShowInquiryModal(true);
                          }}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Listing Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <CreateListingForm
                  editingListing={editingListing}
                  onSuccess={() => {
                    setShowCreateForm(false);
                    setEditingListing(null);
                  }}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setEditingListing(null);
                  }}
                />
              </div>
            </Card>
          </div>
        )}

        {/* Inquiry Detail Modal */}
        <InquiryDetailModal
          isOpen={showInquiryModal}
          onClose={() => {
            setShowInquiryModal(false);
            setSelectedInquiry(null);
          }}
          inquiry={selectedInquiry}
          onStatusChange={async (status) => {
            if (selectedInquiry) {
              updateInquiryStatus.mutate({
                inquiryId: selectedInquiry.id,
                status: status as any,
              });
            }
          }}
        />
      </div>
    </div>
  );
}
