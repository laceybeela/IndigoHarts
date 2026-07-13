'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './button';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.8;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploadProps {
  onUpload: (file: File, caption?: string) => void;
  loading?: boolean;
}

function resizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);

      // Skip resize if already small enough in both dimensions and file size
      if (img.width <= MAX_DIMENSION && img.height <= MAX_DIMENSION && file.size <= MAX_SIZE) {
        resolve(file);
        return;
      }

      // Calculate scaled dimensions
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          // Keep original name but always output as JPEG
          const name = file.name.replace(/\.\w+$/, '.jpg');
          resolve(new File([blob], name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export function ImageUpload({ onUpload, loading }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resizing, setResizing] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Only JPG, PNG, and WebP files are accepted.');
        return;
      }
      try {
        setResizing(true);
        const processed = await resizeImage(file);
        setPendingFile(processed);
      } catch {
        setError('Failed to process image. Please try another file.');
      } finally {
        setResizing(false);
      }
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!pendingFile) return;
    onUpload(pendingFile, caption.trim() || undefined);
    setPendingFile(null);
    setCaption('');
  }, [pendingFile, caption, onUpload]);

  const handleClearFile = useCallback(() => {
    setPendingFile(null);
    setCaption('');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [processFile]
  );

  const isProcessing = loading || resizing;

  // Show title input + preview after a file is selected
  if (pendingFile) {
    const previewUrl = URL.createObjectURL(pendingFile);
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-24 w-24 rounded-lg object-cover"
            onLoad={() => URL.revokeObjectURL(previewUrl)}
          />
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Master Bedroom, Kitchen, Pool"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} loading={loading}>
            Upload
          </Button>
          <Button variant="ghost" onClick={handleClearFile} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? 'border-sage-500 bg-sage-50'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        <Upload className="mb-3 h-8 w-8 text-gray-400" />
        <p className="mb-1 text-sm text-gray-600">
          Drag and drop an image here, or
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          loading={isProcessing}
        >
          {resizing ? 'Resizing...' : 'Choose File'}
        </Button>
        <p className="mt-2 text-xs text-gray-400">
          JPG, PNG, or WebP — large photos are automatically resized
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
