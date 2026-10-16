import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface NotificationPreferencesProps {
  userId?: number;
  onSave?: () => void;
}

export default function NotificationPreferences({ userId, onSave }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    notifyOnNewInquiry: true,
    notifyOnInquiryUpdate: true,
  });
  const [loading, setLoading] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setPushSupported(supported);
  }, []);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID not available");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...preferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      toast.success("Notification preferences saved");
      onSave?.();
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleEnablePushNotifications = async () => {
    if (!pushSupported) {
      toast.error("Push notifications not supported in your browser");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPreferences((prev) => ({
          ...prev,
          pushNotifications: true,
        }));
        toast.success("Push notifications enabled");
      } else {
        toast.error("Push notification permission denied");
      }
    } catch (error) {
      console.error("Error enabling push notifications:", error);
      toast.error("Failed to enable push notifications");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black mb-2">Notification Preferences</h2>
        <p className="text-gray-600">Manage how you receive updates about inquiries and system notifications</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-black">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive email alerts for new inquiries and updates</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("emailNotifications")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.emailNotifications ? "bg-red-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-black">Push Notifications</h3>
                <p className="text-sm text-gray-600">Get instant browser notifications</p>
                {!pushSupported && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>Not supported in your browser</span>
                  </div>
                )}
              </div>
            </div>
            {pushSupported ? (
              <button
                onClick={() => handleToggle("pushNotifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.pushNotifications ? "bg-red-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.pushNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            ) : (
              <Button onClick={handleEnablePushNotifications} variant="outline" size="sm">
                Enable
              </Button>
            )}
          </div>

          {/* Notify on New Inquiry */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-black">New Inquiry Alerts</h3>
              <p className="text-sm text-gray-600">Alert me when I receive a new inquiry</p>
            </div>
            <button
              onClick={() => handleToggle("notifyOnNewInquiry")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.notifyOnNewInquiry ? "bg-red-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.notifyOnNewInquiry ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Notify on Inquiry Update */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-black">Inquiry Update Alerts</h3>
              <p className="text-sm text-gray-600">Alert me when an inquiry status is updated</p>
            </div>
            <button
              onClick={() => handleToggle("notifyOnInquiryUpdate")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.notifyOnInquiryUpdate ? "bg-red-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.notifyOnInquiryUpdate ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Note:</p>
            <p>You can manage notification preferences at any time. Disabling notifications will not affect your account or listings.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
