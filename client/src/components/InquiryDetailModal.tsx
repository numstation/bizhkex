import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, Building2, MessageSquare, Clock } from "lucide-react";

interface InquiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: any;
  onStatusChange?: (status: string) => void;
  onRespond?: (message: string) => void;
}

export default function InquiryDetailModal({
  isOpen,
  onClose,
  inquiry,
  onStatusChange,
  onRespond,
}: InquiryDetailModalProps) {
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(inquiry?.status || "new");

  if (!inquiry) return null;

  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus);
    if (onStatusChange) {
      try {
        await onStatusChange(newStatus);
        toast.success("Status updated successfully");
      } catch (error) {
        toast.error("Failed to update status");
        setSelectedStatus(inquiry.status);
      }
    }
  };

  const handleSendResponse = async () => {
    if (!responseMessage.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onRespond) {
        await onRespond(responseMessage);
        setResponseMessage("");
        toast.success("Response sent successfully");
      }
    } catch (error) {
      toast.error("Failed to send response");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>
            View and manage inquiry from {inquiry?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Inquiry Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-lg font-semibold text-black">{inquiry?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Company</label>
                <p className="text-lg font-semibold text-black">
                  {inquiry?.company || "Not specified"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm text-black break-all">{inquiry?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm text-black">{inquiry?.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            {inquiry?.office && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Office</label>
                  <p className="text-sm text-black">{inquiry.office.name}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <label className="text-sm font-medium text-gray-600">Received</label>
                <p className="text-sm text-black">{formatDate(inquiry?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-gray-600">Message</label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry?.message}</p>
            </div>
          </div>

          {/* Status Management */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Status</label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedStatus)}`}>
              {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
            </div>
          </div>

          {/* Response Form */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-600">Send Response</label>
            </div>
            <Textarea
              placeholder="Type your response message here..."
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={handleSendResponse}
                disabled={isSubmitting || !responseMessage.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Sending..." : "Send Response"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
