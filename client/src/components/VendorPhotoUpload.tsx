import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { usePublicTheme } from "@/hooks/usePublicTheme";

const MAX_PHOTOS = 4;
const MAX_BYTES = 4 * 1024 * 1024;

type Props = {
  label: string;
  hint: string;
  uploadingLabel: string;
  maxReachedLabel: string;
  invalidTypeLabel: string;
  tooLargeLabel: string;
  uploadErrorLabel: string;
  photos: string[];
  onChange: (urls: string[]) => void;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function VendorPhotoUpload({
  label,
  hint,
  uploadingLabel,
  maxReachedLabel,
  invalidTypeLabel,
  tooLargeLabel,
  uploadErrorLabel,
  photos,
  onChange,
}: Props) {
  const theme = usePublicTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const uploadMutation = trpc.vendor.uploadPhoto.useMutation();

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    if (photos.length >= MAX_PHOTOS) {
      toast.error(maxReachedLabel);
      return;
    }

    setUploading(true);
    const next = [...photos];

    try {
      for (const file of Array.from(files)) {
        if (next.length >= MAX_PHOTOS) break;
        if (!file.type.startsWith("image/")) {
          toast.error(invalidTypeLabel);
          continue;
        }
        if (file.size > MAX_BYTES) {
          toast.error(tooLargeLabel);
          continue;
        }
        const dataBase64 = await readFileAsDataUrl(file);
        const { url } = await uploadMutation.mutateAsync({
          fileName: file.name,
          dataBase64,
        });
        next.push(url);
      }
      onChange(next);
    } catch {
      toast.error(uploadErrorLabel);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className={`text-xs ${theme.label} mb-1.5 block`}>{label}</label>
      <p className={`text-[11px] ${theme.subtle} mb-3`}>{hint}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {photos.map((url, index) => (
          <div key={`${url.slice(0, 32)}-${index}`} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-white/[0.08]">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={`aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${theme.filterPillInactive}`}
          >
            {uploading ? (
              <Loader2 className={`w-6 h-6 animate-spin ${theme.accent}`} />
            ) : (
              <ImagePlus className={`w-6 h-6 ${theme.muted}`} />
            )}
            <span className={`text-[10px] ${theme.subtle}`}>
              {uploading ? uploadingLabel : `${photos.length}/${MAX_PHOTOS}`}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
