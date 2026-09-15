"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw, X } from "lucide-react";
import { sampleLeaves } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onAnalyze: (fileOrSampleId: File | string, previewUrl: string) => void;
  isLoading: boolean;
  validationError?: string | null;
}

// Client-side pre-flight checks before sending to backend
function validateImageFile(file: File): string | null {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const MIN_SIZE = 5 * 1024;          // 5KB — reject blank/corrupt files
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Unsupported format "${file.type || 'unknown'}". Please upload a JPG, PNG, or WEBP image.`;
  }
  if (file.size > MAX_SIZE) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 10 MB.`;
  }
  if (file.size < MIN_SIZE) {
    return "File appears to be blank or corrupted (under 5 KB). Please upload a clear leaf photo.";
  }
  return null;
}

export function ImageUploader({ onAnalyze, isLoading, validationError }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setClientError(null);

    if (rejectedFiles && rejectedFiles.length > 0) {
      const reason = rejectedFiles[0]?.errors?.[0];
      if (reason?.code === "file-too-large") {
        setClientError("File exceeds 10 MB limit. Please compress or resize the image.");
      } else if (reason?.code === "file-invalid-type") {
        setClientError("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
      } else {
        setClientError("File rejected. Please upload a valid crop leaf image.");
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const err = validateImageFile(file);
      if (err) {
        setClientError(err);
        return;
      }
      setSelectedFile(file);
      setSelectedSampleId(null);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleSelectSample = (sample: typeof sampleLeaves[0]) => {
    setClientError(null);
    setSelectedFile(null);
    setSelectedSampleId(sample.id);
    setPreviewUrl(sample.image);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSelectedSampleId(null);
    setPreviewUrl(null);
    setClientError(null);
  };

  const handleStartAnalysis = () => {
    setClientError(null);
    if (selectedSampleId && previewUrl) {
      onAnalyze(selectedSampleId, previewUrl);
    } else if (selectedFile && previewUrl) {
      onAnalyze(selectedFile, previewUrl);
    }
  };

  // Show client error or backend Pl@ntNet rejection
  const displayError = clientError || validationError;

  return (
    <div className="space-y-6">

      {/* Pl@ntNet / client validation error banner */}
      {displayError && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-800">Invalid Image — Not a Plant</p>
            <p className="mt-0.5 text-xs text-rose-700 leading-relaxed">{displayError}</p>
            <p className="mt-2 text-xs text-rose-600 font-medium">
              ✅ Accepted: crop leaves, plant foliage, diseased leaf close-ups<br />
              ❌ Rejected: logos, people, animals, buildings, cars, blank images
            </p>
          </div>
        </div>
      )}

      {/* Upload Box or Image Preview */}
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-colors cursor-pointer bg-white",
            isDragActive
              ? "border-emerald-500 bg-emerald-50/50"
              : "border-stone-300 hover:border-emerald-600 hover:bg-stone-50/80"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100/70 text-emerald-800 mb-4 shadow-xs">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900">
            Upload Plant Foliage or Crop Leaf
          </h3>
          <p className="mt-1 text-sm text-stone-500 max-w-md">
            Drag & drop high-resolution photo here, or click to browse files. Supports JPG, PNG, WEBP up to 10MB.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-stone-400">
            <span>✓ High Contrast</span>
            <span>•</span>
            <span>✓ Clear Lesion Focus</span>
            <span>•</span>
            <span>✓ Single Leaf View</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-stone-800">
                {selectedSampleId ? "Sample Dataset Leaf Loaded" : "Captured Image Ready"}
              </span>
            </div>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 p-1 rounded"
            >
              <X className="h-4 w-4" />
              <span>Change Image</span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-stone-100 border border-stone-200">
              <img src={previewUrl} alt="Uploaded Leaf Preview" className="h-full w-full object-cover" />
              {isLoading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                  <div className="h-8 w-8 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin mb-3" />
                  <p className="font-semibold text-sm">Analyzing Pathology...</p>
                  <p className="text-xs text-stone-300 mt-1">Extracting botanical features & lesion markers</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-stone-50 p-4 border border-stone-200/80">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Ready for Computer Vision Pipeline
                </div>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Our trained computer vision model will evaluate chlorotic rings, necrosis, sporulation patterns, and foliage deformation to return verified diagnosis, confidence, and treatment guidelines.
                </p>
              </div>

              <button
                onClick={handleStartAnalysis}
                disabled={isLoading}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 font-semibold text-white shadow-sm transition-all",
                  isLoading
                    ? "bg-emerald-800/80 cursor-not-allowed"
                    : "bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99]"
                )}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Inference in Progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Run AI Crop Diagnosis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preloaded Sample Leaves */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5" />
            Quick Demo Samples (Click to test instantly)
          </span>
          <span className="text-[11px] text-stone-400">Pre-validated benchmark imagery</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleLeaves.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              disabled={isLoading}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all",
                selectedSampleId === sample.id
                  ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                  : "border-stone-200 bg-white hover:border-stone-300"
              )}
            >
              <img
                src={sample.image}
                alt={sample.label}
                className="h-12 w-12 rounded-lg object-cover border border-stone-200 shrink-0"
              />
              <div className="overflow-hidden">
                <div className="font-semibold text-xs text-stone-900 truncate">{sample.label}</div>
                <div className="text-[11px] text-stone-500 truncate">{sample.crop}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
