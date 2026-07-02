import { useState } from 'react';
import { Film, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OfferVideo from '@/components/OfferVideo';

interface VideoUploadFieldProps {
  label: string;
  hint: string;
  videos: string[];
  onChange: (videos: string[]) => void;
  addUrlLabel: string;
  uploadLabel: string;
  unsupportedFormat: string;
  tooLarge: string;
  uploadFailed: string;
}

export default function VideoUploadField({
  label,
  hint,
  videos,
  onChange,
  addUrlLabel,
  uploadLabel,
  unsupportedFormat,
  tooLarge,
  uploadFailed,
}: VideoUploadFieldProps) {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange([...videos, trimmed]);
    setUrlInput('');
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const { isValidVideoFile, getFileSizeMB, uploadVideoToServer } = await import('@/utils/videoUtils');
      if (!isValidVideoFile(file)) {
        alert(unsupportedFormat);
        return;
      }
      if (getFileSizeMB(file) > 180) {
        alert(tooLarge);
        return;
      }
      const url = await uploadVideoToServer(file);
      onChange([...videos, url]);
    } catch (error) {
      console.error('Video upload error', error);
      alert(uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-pink-200 bg-pink-50/60 dark:bg-pink-950/20 dark:border-pink-800/50 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center flex-shrink-0">
          <Film className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900 dark:text-slate-100">{label}</h4>
          <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">{hint}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://youtube.com/..."
          className="flex-1 rounded-xl"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
        />
        <Button type="button" variant="outline" onClick={addUrl} className="rounded-xl">
          {addUrlLabel}
        </Button>
        <label className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl cursor-pointer font-medium transition-colors">
          <Upload className="h-4 w-4" />
          {uploading ? '...' : uploadLabel}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await uploadFile(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {videos.map((video, index) => (
            <div key={`${video}-${index}`} className="relative border rounded-xl p-2 bg-white dark:bg-slate-900">
              <OfferVideo src={video} className="w-full h-44 rounded-lg bg-black" />
              <button
                type="button"
                onClick={() => onChange(videos.filter((_, i) => i !== index))}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow"
                aria-label="حذف الفيديو"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
