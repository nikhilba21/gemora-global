// useStorageUpload.ts — Cloudinary free-tier upload (replaces ICP blob storage)
// Images upload to Cloudinary unsigned upload preset
import { useState } from 'react';

const CLOUDINARY_CLOUD = (import.meta as { env: Record<string, string> }).env?.VITE_CLOUDINARY_CLOUD || 'gemora-global';
const UPLOAD_PRESET = (import.meta as { env: Record<string, string> }).env?.VITE_CLOUDINARY_PRESET || 'gemora_unsigned';

export type UploadResult = {
  url: string;
  originalKB: number;
  webpKB: number;
  savedPercent: number;
  wasConverted: boolean;
};

async function uploadToCloudinary(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'gemora');

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        resolve(res.secure_url);
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export function useStorageUpload() {
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);
    setProgress(0);
    setUploadError(null);
    try {
      const url = await uploadToCloudinary(file, setProgress);
      setProgress(100);
      return url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
    }
  };

  const uploadFileDetailed = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setProgress(0);
    setUploadError(null);
    try {
      const originalKB = file.size / 1024;
      const url = await uploadToCloudinary(file, setProgress);
      setProgress(100);
      return { url, originalKB, webpKB: originalKB, savedPercent: 0, wasConverted: false };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploadFileDetailed, uploading, converting, progress, uploadError };
}
