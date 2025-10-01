import React from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  videoTitle?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc, videoTitle }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-white hover:text-gray-300"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative bg-white dark:bg-black">
          <video
            src={videoSrc}
            controls
            className="w-full h-full max-h-[90vh] object-contain"
            onError={(e) => {
              console.error('Video failed to load:', videoSrc);
              const target = e.target as HTMLVideoElement;
              target.style.display = 'none';
              const errorDiv = target.nextElementSibling as HTMLElement;
              if (errorDiv) errorDiv.style.display = 'flex';
            }}
          />
          <div 
            className="absolute inset-0 w-full h-full bg-gray-800 flex items-center justify-center text-gray-400 hidden"
          >
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">Failed to load video</p>
              <p className="text-sm mt-2">The video file could not be loaded.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
