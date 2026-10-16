import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const PHOTO_URLS = {
  "Central Premium Tower": "https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-central-premium-cWwAwMUWzSBHRemh3xuwkq.webp",
  "Causeway Bay Business Hub": "https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-causeway-bay-KQ6Fqeu4ZnzfbkdAwET46B.webp",
  "Admiralty Executive Suites": "https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-admiralty-CgyTkP7NhzrEtcAx6HvjJh.webp",
  "Mong Kok Tech Space": "https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-mongkok-2xUagTu6ymSmys3tG2BZT9.webp",
  "Tsim Sha Tsui Premium Office": "https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-tsim-sha-tsui-irBHFKMqrVS5M7a6nQwdXH.webp",
};

interface PhotoManagerProps {
  onSuccess?: () => void;
}

export function PhotoManager({ onSuccess }: PhotoManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const bulkUpdatePhotos = trpc.admin.bulkUpdatePhotos.useMutation();

  const handleUpdatePhotos = async () => {
    setIsLoading(true);
    try {
      const result = await bulkUpdatePhotos.mutateAsync({
        photoMappings: PHOTO_URLS,
      });
      setResults(result);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating photos:", error);
      setResults({ success: false, error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-black mb-2">Update Office Photos</h3>
          <p className="text-gray-600 text-sm mb-4">
            Click the button below to update all office listings with professional photos
          </p>
        </div>

        <Button
          onClick={handleUpdatePhotos}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Updating Photos...
            </>
          ) : (
            <>
              <Upload size={18} className="mr-2" />
              Update All Office Photos
            </>
          )}
        </Button>

        {results && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              {results.success ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <AlertCircle className="text-red-600" size={20} />
              )}
              <span className="font-semibold text-black">
                {results.success ? "Update Successful" : "Update Failed"}
              </span>
            </div>

            {results.results && (
              <div className="space-y-2">
                {results.results.map((result: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{result.officeName}</span>
                    {result.success ? (
                      <span className="text-green-600 font-medium">✓ Updated</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Failed</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Photos to be updated:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            {Object.keys(PHOTO_URLS).map((name) => (
              <li key={name}>• {name}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
