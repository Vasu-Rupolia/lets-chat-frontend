"use client";

import Cropper from "react-easy-crop";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  image: string | null;
  crop: {
    x: number;
    y: number;
  };
  zoom: number;

  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;

  onCropComplete: (
    croppedArea: any,
    croppedAreaPixels: any
  ) => void;

  onClose: () => void;

  onSave: () => void;

  loading?: boolean;
};

export default function CropperModal({
  open,
  image,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
  loading = false,
}: Props) {
  if (!open || !image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-5">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-5">

          <h2 className="text-2xl font-bold">
            Crop Profile Picture
          </h2>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-gray-100"
          >
            <X className="mx-auto" />
          </button>

        </div>

        {/* Cropper */}

        <div className="relative h-[420px] bg-gray-900">

          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />

        </div>

        {/* Zoom */}

        <div className="p-6">

          <label className="text-sm font-medium text-gray-600">

            Zoom

          </label>

          <input
            className="w-full mt-3"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) =>
              onZoomChange(Number(e.target.value))
            }
          />

        </div>

        {/* Footer */}

        <div className="border-t p-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

        </div>

      </div>

    </div>
  );
}