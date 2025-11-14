import React from 'react';
import CameraUpload from '@/components/CameraUpload';
import GoogleSignInButton from '@/components/GoogleSignInButton';

type UploadMode = 'camera' | 'library';

interface UploadStateProps {
  uploadMode: UploadMode;
  selectedPhoto: File | null;
  isAuthenticated: boolean;
  onPhotoSelect: (file: File, mimeType: string) => void;
  onClearPhoto: () => void;
}

export const UploadState: React.FC<UploadStateProps> = ({
  uploadMode,
  selectedPhoto,
  isAuthenticated,
  onPhotoSelect,
  onClearPhoto,
}) => (
  <div className="flex-1 flex items-start justify-center sm:pt-10 sm:p-8 lg:items-center">
    <div className="w-full max-w-lg">
      <div className="my-6">
        <CameraUpload
          mode={uploadMode}
          onPhotoSelect={onPhotoSelect}
          onClearPhoto={onClearPhoto}
          selectedPhoto={selectedPhoto}
        />
      </div>
      {!isAuthenticated && (
        <div className="my-6 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-base text-slate-600 mb-3 text-md sm:text-md text-center ">
            Sign up to get 5 free credits!
          </p>
          <GoogleSignInButton
            variant="outline"
            size="sm"
            className="text-base w-full py-3"
          >
            Sign up with Google
          </GoogleSignInButton>
        </div>
      )}
    </div>
  </div>
);