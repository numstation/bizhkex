import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface NotificationPreference {
  inquiryResponse: boolean;
  statusUpdates: boolean;
  newOfferings: boolean;
  weeklyDigest: boolean;
}

interface EmailNotificationPreferencesProps {
  onSave?: (preferences: NotificationPreference) => void;
}

export function EmailNotificationPreferences({ onSave }: EmailNotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreference>({
    inquiryResponse: true,
    statusUpdates: true,
    newOfferings: false,
    weeklyDigest: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof NotificationPreference) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage for now (in production, would save to backend)
      localStorage.setItem("emailNotificationPreferences", JSON.stringify(preferences));
      setSaved(true);
      toast.success("Notification preferences saved");
      if (onSave) onSave(preferences);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error("Failed to save preferences");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-200">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Mail className="text-red-600" size={24} />
          <div>
            <h3 className="text-lg font-bold text-black">Email Notification Preferences</h3>
            <p className="text-sm text-gray-600">Choose which emails you'd like to receive</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-4">
          {/* Inquiry Response Notifications */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              checked={preferences.inquiryResponse}
              onCheckedChange={() => handleToggle("inquiryResponse")}
              className="mt-1"
            />
            <div className="flex-1">
              <label className="font-semibold text-black cursor-pointer">
                Provider Responses
              </label>
              <p className="text-sm text-gray-600">
                Get notified when a provider responds to your inquiry
              </p>
            </div>
          </div>

          {/* Status Update Notifications */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              checked={preferences.statusUpdates}
              onCheckedChange={() => handleToggle("statusUpdates")}
              className="mt-1"
            />
            <div className="flex-1">
              <label className="font-semibold text-black cursor-pointer">
                Status Updates
              </label>
              <p className="text-sm text-gray-600">
                Get notified when your inquiry status changes
              </p>
            </div>
          </div>

          {/* New Offerings Notifications */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              checked={preferences.newOfferings}
              onCheckedChange={() => handleToggle("newOfferings")}
              className="mt-1"
            />
            <div className="flex-1">
              <label className="font-semibold text-black cursor-pointer">
                New Office Listings
              </label>
              <p className="text-sm text-gray-600">
                Get notified about new office spaces matching your interests
              </p>
            </div>
          </div>

          {/* Weekly Digest */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              checked={preferences.weeklyDigest}
              onCheckedChange={() => handleToggle("weeklyDigest")}
              className="mt-1"
            />
            <div className="flex-1">
              <label className="font-semibold text-black cursor-pointer">
                Weekly Digest
              </label>
              <p className="text-sm text-gray-600">
                Receive a weekly summary of your inquiries and new listings
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={handleSave}
            disabled={isSaving || saved}
            className="bg-red-600 hover:bg-red-700 text-white flex-1"
          >
            {saved ? (
              <>
                <CheckCircle size={18} className="mr-2" />
                Saved
              </>
            ) : (
              <>
                <Bell size={18} className="mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> You can update these preferences anytime. We'll never share your email with third parties.
          </p>
        </div>
      </div>
    </Card>
  );
}
