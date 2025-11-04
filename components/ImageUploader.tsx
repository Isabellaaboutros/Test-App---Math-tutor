
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (base64: string, fileType: string) => void;
  image: string | null;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, image, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(dragging);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-brand-surface rounded-lg p-4 md:p-8 space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-brand-text">Your Math Problem</h2>
      <p className="text-sm text-brand-text-dim text-center">Upload a photo of your calculus or algebra problem.</p>
      
      {image ? (
        <div className="w-full mt-4 p-2 border-2 border-dashed border-brand-primary rounded-lg">
          <img src={image} alt="Math problem" className="max-h-[60vh] md:max-h-full w-full object-contain rounded-md" />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDrop={handleDrop}
          className={`mt-4 w-full flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${isDragging ? 'border-brand-accent bg-brand-primary' : 'border-brand-primary hover:border-brand-accent'}`}
        >
          <div className="text-center p-6">
            <UploadIcon className="mx-auto h-12 w-12 text-brand-secondary" />
            <p className="mt-2 text-brand-text-dim">
              <span className="font-semibold text-brand-accent">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-brand-secondary">PNG, JPG, or WEBP</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
};
