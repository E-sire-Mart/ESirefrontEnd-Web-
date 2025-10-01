import React, { useState } from 'react';
import { Review as ReviewType } from '../../utils/types';
import Rating from './Rating';
import VideoModal from './VideoModal';
import ImageModal from './ImageModal';

interface ReviewModalProps {
  review: ReviewType;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onDislike: () => void;
  isLiked: boolean;
  isDisliked: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  review,
  isOpen,
  onClose,
  onLike,
  onDislike,
  isLiked,
  isDisliked,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleVideoClick = (videoSrc: string) => {
    setSelectedVideo(videoSrc);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - reviewDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {review.user?.avatar ? (
                <img
                  src={`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/${review.user.avatar}`}
                  alt={review.user?.first_name || review.user?.username || 'User'}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-gray-600 ${
                  review.user?.avatar ? 'hidden' : 'flex'
                }`}
              >
                {(review.user?.first_name?.charAt(0) || review.user?.username?.charAt(0) || 'U').toUpperCase()}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {review.user?.first_name && review.user?.last_name
                  ? `${review.user.first_name} ${review.user.last_name}`
                  : review.user?.username || 'Anonymous User'
                }
              </h3>
              <p className="text-gray-400 mb-2">{formatTimeAgo(review.createdAt)}</p>
              <Rating rating={review.rating} size="md" />
            </div>

            {/* Like/Dislike */}
            <div className="flex items-center gap-4">
              <button
                onClick={onLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>Like</span>
              </button>
              
              <button
                onClick={onDislike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDisliked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.333v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
                <span>Dislike</span>
              </button>
            </div>
          </div>

          {/* Review Content */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Review</h4>
            <p className="text-gray-300 leading-relaxed text-base">
              {review.comment}
            </p>
          </div>

          {/* Media Gallery */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Media</h4>
            {review.media && (review.media.photos.length > 0 || review.media.videos.length > 0) ? (
              <div>
                <h5 className="text-md font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Media ({review.media.photos.length + review.media.videos.length})
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Display photos and videos together */}
                  {review.media.photos.map((photo, index) => {
                    const imageUrl = `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/review-media/${photo.filename}`;
                    return (
                      <div key={`photo-${index}`} className="relative group cursor-pointer" onClick={() => handleImageClick(imageUrl)}>
                        <img
                          src={imageUrl}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                          onError={(e) => {
                            console.error('Image failed to load:', photo.filename, 'URL:', imageUrl);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', photo.filename, 'URL:', imageUrl);
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Photo
                        </div>
                      </div>
                    );
                  })}
                  
                  {review.media.videos.map((video, index) => {
                    const videoUrl = `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/review-media/${video.filename}`;
                    return (
                      <div key={`video-${index}`} className="relative group cursor-pointer" onClick={() => handleVideoClick(videoUrl)}>
                        <video
                          src={videoUrl}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                          preload="metadata"
                          onError={(e) => {
                            console.error('Video failed to load:', video.filename);
                            const target = e.target as HTMLVideoElement;
                            target.style.display = 'none';
                          }}
                          onLoadedMetadata={() => {
                            console.log('Video metadata loaded:', video.filename);
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                          <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Video
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          {video.originalName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-600">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg font-medium mb-2">No media uploaded</p>
                <p className="text-gray-500 text-sm">This review doesn't have any photos or videos</p>
              </div>
            )}
          </div>

          {/* Review Stats */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Review Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Rating:</span>
                <span className="text-gray-900 dark:text-white ml-2">{review.rating}/5 stars</span>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <span className="text-gray-900 dark:text-white ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Verified:</span>
                <span className={`ml-2 ${review.isVerified ? 'text-green-400' : 'text-gray-400'}`}>
                  {review.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && selectedVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={handleCloseVideoModal}
          videoSrc={selectedVideo}
          videoTitle="Review Video"
        />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={handleCloseImageModal}
          imageUrl={selectedImage}
          alt="Review photo"
        />
      )}
    </div>
  );
};

export default ReviewModal;
