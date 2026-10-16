import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PhotoManager } from "@/components/PhotoManager";
import { Card } from "@/components/ui/card";

export default function Admin() {
  const { user, loading } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    districtId: 1,
    basePrice: 0,
    rating: 4.5,
    reviewCount: 0,
    description: "",
    amenities: "",
    thumbnailUrl: "",
  });

  // Fetch offices
  const { data: offices = [], refetch: refetchOffices } = trpc.offices.list.useQuery({
    limit: 100,
  });

  const { data: districts = [] } = trpc.districts.list.useQuery();

  // tRPC mutations
  const createOfficeMutation = trpc.offices.create.useMutation();
  const updateOfficeMutation = trpc.offices.update.useMutation();
  const deleteOfficeMutation = trpc.offices.delete.useMutation();

  // Filter offices by search
  const filteredOffices = useMemo(() => {
    if (!searchKeyword) return offices;
    return offices.filter(
      (office: any) =>
        office.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        office.address.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [offices, searchKeyword]);

  const [, setLocation] = useLocation();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (loading) return;
    // Temporarily disable admin access for review
    setLocation("/");
  }, [loading, setLocation]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  // Admin access temporarily disabled
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin" size={32} />
    </div>
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // For now, we'll use a placeholder URL
      // In production, you would upload to CDN here
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: url,
      }));
      toast.success("Image selected successfully");
    } catch (error) {
      toast.error("Failed to select image");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateOffice = async () => {
    if (!formData.name || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createOfficeMutation.mutateAsync({
        name: formData.name,
        address: formData.address,
        districtId: formData.districtId,
        basePrice: formData.basePrice,
        rating: formData.rating,
        reviewCount: formData.reviewCount,
        description: formData.description,
        amenities: formData.amenities,
        thumbnailUrl: formData.thumbnailUrl,
      });
      toast.success("Office created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        address: "",
        districtId: 1,
        basePrice: 0,
        rating: 4.5,
        reviewCount: 0,
        description: "",
        amenities: "",
        thumbnailUrl: "",
      });
      refetchOffices();
    } catch (error) {
      toast.error("Failed to create office");
      console.error(error);
    }
  };

  const handleEditOffice = (office: any) => {
    setEditingOffice(office);
    setFormData({
      name: office.name,
      address: office.address,
      districtId: office.districtId,
      basePrice: office.basePrice,
      rating: office.rating,
      reviewCount: office.reviewCount,
      description: office.description || "",
      amenities: office.amenities || "",
      thumbnailUrl: office.thumbnailUrl || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateOffice = async () => {
    if (!editingOffice) return;

    try {
      await updateOfficeMutation.mutateAsync({
        id: editingOffice.id,
        name: formData.name,
        address: formData.address,
        districtId: formData.districtId,
        basePrice: formData.basePrice,
        rating: formData.rating,
        reviewCount: formData.reviewCount,
        description: formData.description,
        amenities: formData.amenities,
        thumbnailUrl: formData.thumbnailUrl,
      });
      toast.success("Office updated successfully");
      setIsEditDialogOpen(false);
      setEditingOffice(null);
      refetchOffices();
    } catch (error) {
      toast.error("Failed to update office");
      console.error(error);
    }
  };

  const handleDeleteOffice = async (officeId: number) => {
    if (!confirm("Are you sure you want to delete this office?")) return;

    try {
      await deleteOfficeMutation.mutateAsync({ id: officeId });
      toast.success("Office deleted successfully");
      refetchOffices();
    } catch (error) {
      toast.error("Failed to delete office");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Office Management</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary-red flex gap-2">
                <Plus size={18} />
                Add New Office
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Office</DialogTitle>
                <DialogDescription>
                  Add a new serviced office to your marketplace
                </DialogDescription>
              </DialogHeader>
              <OfficeForm
                formData={formData}
                setFormData={setFormData}
                districts={districts}
                uploadingImage={uploadingImage}
                onImageUpload={handleImageUpload}
                onSubmit={handleCreateOffice}
                submitLabel="Create Office"
                isLoading={createOfficeMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Photo Manager */}
        <PhotoManager onSuccess={() => refetchOffices()} />

        {/* Search */}
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search offices by name or location..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Offices Table */}
        <div className="border border-black rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-black">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Office Name</th>
                <th className="px-6 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Rating</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffices.map((office: any) => (
                <tr key={office.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{office.name}</td>
                  <td className="px-6 py-4 text-gray-600">{office.address}</td>
                  <td className="px-6 py-4 font-semibold">HK${office.basePrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-yellow-500">★</span> {office.rating}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditOffice(office)}
                      className="flex gap-1"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteOffice(office.id)}
                      className="flex gap-1 text-red-600 border-red-600 hover:bg-red-50"
                      disabled={deleteOfficeMutation.isPending}
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOffices.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600">No offices found</p>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Office</DialogTitle>
              <DialogDescription>
                Update the details of this serviced office
              </DialogDescription>
            </DialogHeader>
            <OfficeForm
              formData={formData}
              setFormData={setFormData}
              districts={districts}
              uploadingImage={uploadingImage}
              onImageUpload={handleImageUpload}
              onSubmit={handleUpdateOffice}
              submitLabel="Update Office"
              isLoading={updateOfficeMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

// Office Form Component
function OfficeForm({
  formData,
  setFormData,
  districts,
  uploadingImage,
  onImageUpload,
  onSubmit,
  submitLabel,
  isLoading,
}: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Office Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Central Premium Tower"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">District</label>
          <select
            value={formData.districtId}
            onChange={(e) => setFormData({ ...formData, districtId: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {districts.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Address *</label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="e.g., 1 Exchange Square, Central"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Base Price (HK$)</label>
          <Input
            type="number"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
            placeholder="15000"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Rating</label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
            placeholder="4.8"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Review Count</label>
          <Input
            type="number"
            value={formData.reviewCount}
            onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) })}
            placeholder="124"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this office space..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Amenities (comma-separated)</label>
        <Input
          value={formData.amenities}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          placeholder="WiFi, Meeting Rooms, Parking, Gym"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Thumbnail Image</label>
        <div className="flex gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={uploadingImage}
            className="flex-1"
          />
          {uploadingImage && <Loader2 className="animate-spin" size={20} />}
        </div>
        {formData.thumbnailUrl && (
          <div className="mt-2">
            <img
              src={formData.thumbnailUrl}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-md border border-gray-300"
            />
          </div>
        )}
      </div>

      <Button 
        onClick={onSubmit} 
        className="btn-primary-red w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            Processing...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
