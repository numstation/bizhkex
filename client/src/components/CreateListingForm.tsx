'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface CreateListingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editingListing?: any;
}

interface ListingFormData {
  name: string;
  address: string;
  districtId: string;
  description: string;
  basePrice: string;
  thumbnailUrl: string;
  amenities: string[];
  pricingPackages: Array<{
    name: string;
    duration: string;
    price: string;
  }>;
}

const AMENITIES = [
  "WiFi",
  "Parking",
  "Meeting Rooms",
  "Reception",
  "Kitchen",
  "Lounge",
  "Gym",
  "Security",
  "24/7 Access",
  "Printing",
  "Mail Service",
  "Phone System",
];

const DISTRICTS = [
  { id: "1", name: "Central", region: "hong_kong_island" },
  { id: "2", name: "Wan Chai", region: "hong_kong_island" },
  { id: "3", name: "Causeway Bay", region: "hong_kong_island" },
  { id: "4", name: "Mong Kok", region: "kowloon" },
  { id: "5", name: "Tsim Sha Tsui", region: "kowloon" },
  { id: "6", name: "Shatin", region: "new_territories" },
];

export default function CreateListingForm({ onSuccess, onCancel, editingListing }: CreateListingFormProps) {
  const [formData, setFormData] = useState<ListingFormData>({
    name: "",
    address: "",
    districtId: "",
    description: "",
    basePrice: "",
    thumbnailUrl: "",
    amenities: [],
    pricingPackages: [{ name: "Monthly", duration: "1 month", price: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with editing data if provided
  useEffect(() => {
    if (editingListing) {
      setFormData({
        name: editingListing.name || "",
        address: editingListing.address || "",
        districtId: editingListing.districtId?.toString() || "",
        description: editingListing.description || "",
        basePrice: editingListing.basePrice?.toString() || "",
        thumbnailUrl: editingListing.thumbnailUrl || "",
        amenities: editingListing.amenitiesJson || [],
        pricingPackages: [{ name: "Monthly", duration: "1 month", price: "" }],
      });
    }
  }, [editingListing]);

  // tRPC mutations
  const createListingMutation = trpc.provider.createListing.useMutation();
  const updateListingMutation = trpc.provider.updateListing.useMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Office name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.districtId) newErrors.districtId = "District is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = "Valid base price is required";
    }
    if (formData.amenities.length === 0) newErrors.amenities = "Select at least one amenity";
    if (formData.pricingPackages.some((p) => !p.price || parseFloat(p.price) <= 0)) {
      newErrors.pricingPackages = "All pricing packages must have valid prices";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handlePricingChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      pricingPackages: prev.pricingPackages.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const addPricingPackage = () => {
    setFormData((prev) => ({
      ...prev,
      pricingPackages: [...prev.pricingPackages, { name: "", duration: "", price: "" }],
    }));
  };

  const removePricingPackage = (index: number) => {
    if (formData.pricingPackages.length > 1) {
      setFormData((prev) => ({
        ...prev,
        pricingPackages: prev.pricingPackages.filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnailUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        districtId: parseInt(formData.districtId),
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        thumbnailUrl: formData.thumbnailUrl,
        amenities: formData.amenities,
        pricingPackages: formData.pricingPackages.map(p => ({
          name: p.name,
          duration: p.duration,
          price: parseFloat(p.price),
        })),
      };

      if (editingListing) {
        await updateListingMutation.mutateAsync({
          id: editingListing.id,
          ...payload,
        });
        toast.success("Listing updated successfully!");
      } else {
        await createListingMutation.mutateAsync(payload);
        toast.success("Listing created successfully!");
      }

      onSuccess?.();
      
      // Reset form if creating new listing
      if (!editingListing) {
        setFormData({
          name: "",
          address: "",
          districtId: "",
          description: "",
          basePrice: "",
          thumbnailUrl: "",
          amenities: [],
          pricingPackages: [{ name: "Monthly", duration: "1 month", price: "" }],
        });
      }
    } catch (error: any) {
      console.error("Error saving listing:", error);
      toast.error(error.message || "Failed to save listing");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!editingListing;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black mb-2">
          {isEditing ? "Edit Listing" : "Create New Listing"}
        </h2>
        <p className="text-gray-600">
          {isEditing ? "Update your office space details" : "Add a new office space to your portfolio"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Office Name *</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Premium Central Office"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Address *</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., 123 Des Voeux Road Central"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">District *</label>
                <select
                  name="districtId"
                  value={formData.districtId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                    errors.districtId ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select a district</option>
                  {DISTRICTS.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.districtId && <p className="text-red-600 text-sm mt-1">{errors.districtId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Base Price (HK$/month) *</label>
                <Input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  className={errors.basePrice ? "border-red-500" : ""}
                />
                {errors.basePrice && <p className="text-red-600 text-sm mt-1">{errors.basePrice}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your office space, amenities, and features..."
                rows={4}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        </Card>

        {/* Image Upload */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Office Image</h3>
          <div className="space-y-4">
            {formData.thumbnailUrl ? (
              <div className="relative">
                <img
                  src={formData.thumbnailUrl}
                  alt="Office thumbnail"
                  className="w-full h-48 object-cover rounded-md border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, thumbnailUrl: "" }))}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload office image</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </Card>

        {/* Amenities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Amenities *</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-black">{amenity}</span>
              </label>
            ))}
          </div>
          {errors.amenities && <p className="text-red-600 text-sm mt-2">{errors.amenities}</p>}
        </Card>

        {/* Pricing Packages */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Pricing Packages *</h3>
            <button
              type="button"
              onClick={addPricingPackage}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm"
            >
              <Plus size={16} /> Add Package
            </button>
          </div>

          <div className="space-y-4">
            {formData.pricingPackages.map((pkg, index) => (
              <div key={index} className="flex gap-3 items-end pb-4 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black mb-1">Package Name</label>
                  <Input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => handlePricingChange(index, "name", e.target.value)}
                    placeholder="e.g., Monthly"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black mb-1">Duration</label>
                  <Input
                    type="text"
                    value={pkg.duration}
                    onChange={(e) => handlePricingChange(index, "duration", e.target.value)}
                    placeholder="e.g., 1 month"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black mb-1">Price (HK$)</label>
                  <Input
                    type="number"
                    value={pkg.price}
                    onChange={(e) => handlePricingChange(index, "price", e.target.value)}
                    placeholder="e.g., 5000"
                  />
                </div>
                {formData.pricingPackages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePricingPackage(index)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.pricingPackages && <p className="text-red-600 text-sm mt-2">{errors.pricingPackages}</p>}
        </Card>

        {/* Form Actions */}
        <div className="flex gap-3">
          <Button 
            type="submit" 
            disabled={loading || createListingMutation.isPending || updateListingMutation.isPending} 
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Listing" : "Create Listing")}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
