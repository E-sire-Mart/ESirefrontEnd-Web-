import React, { useState, useEffect } from 'react';
import { Review as ReviewType, ReviewResponse } from '../../utils/types';
import { getProductReviews } from '../../services/api/reviews';
import Rating from './Rating';
import ReviewModal from './ReviewModal';
import VideoModal from './VideoModal';
import './ReviewSlider.css';

interface ReviewSliderProps {
  productId: string;
  currentUserId?: string;
}

const ReviewSlider: React.FC<ReviewSliderProps> = ({ productId, currentUserId }) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const [dislikedReviews, setDislikedReviews] = useState<Set<string>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const reviewsPerPage = 3;

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= reviewsPerPage) return;

    const interval = setInterval(() => {
      setCurrentPage(prev => {
        const maxPage = Math.ceil(reviews.length / reviewsPerPage) - 1;
        return prev < maxPage ? prev + 1 : 0;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length, reviewsPerPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response: ReviewResponse = await getProductReviews(productId, 1, 20);
      console.log('Fetched reviews with media:', response.reviews);
      response.reviews.forEach((review, index) => {
        console.log(`Review ${index} media:`, review.media);
      });
      setReviews(response.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (reviewId: string) => {
    setLikedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
        // Remove from disliked if it was there
        setDislikedReviews(prevDisliked => {
          const newDislikedSet = new Set(prevDisliked);
          newDislikedSet.delete(reviewId);
          return newDislikedSet;
        });
      }
      return newSet;
    });
  };

  const handleDislike = (reviewId: string) => {
    setDislikedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
        // Remove from liked if it was there
        setLikedReviews(prevLiked => {
          const newLikedSet = new Set(prevLiked);
          newLikedSet.delete(reviewId);
          return newLikedSet;
        });
      }
      return newSet;
    });
  };

  const handleReviewClick = (review: ReviewType) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleVideoClick = (videoSrc: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent review modal from opening
    setSelectedVideo(videoSrc);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const nextPage = () => {
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    const maxPage = Math.ceil(reviews.length / reviewsPerPage) - 1;
    setCurrentPage(prev => (prev < maxPage ? prev + 1 : 0));
  };

  const prevPage = () => {
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    const maxPage = Math.ceil(reviews.length / reviewsPerPage) - 1;
    setCurrentPage(prev => (prev > 0 ? prev - 1 : maxPage));
  };

  const getCurrentReviews = () => {
    const startIndex = currentPage * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return reviews.slice(startIndex, endIndex);
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

  const getReviewTitle = (comment: string) => {
    const words = comment.split(' ');
    if (words.length <= 3) return comment;
    return words.slice(0, 3).join(' ') + '...';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No reviews yet</h3>
          <p className="text-gray-500">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  const currentReviews = getCurrentReviews();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-sm">{reviews.length} reviews</span>
        </div>
      </div>

      {/* Reviews Slider Container */}
      <div className="relative review-slider-container">
        {/* Left Navigation Button */}
        {reviews.length > reviewsPerPage && (
          <button
            onClick={prevPage}
            aria-label="Previous reviews"
            className="absolute -left-5 md:-left-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full transition-colors border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 shadow-lg opacity-70 hover:opacity-100"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Navigation Button */}
        {reviews.length > reviewsPerPage && (
          <button
            onClick={nextPage}
            aria-label="Next reviews"
            className="absolute -right-5 md:-right-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full transition-colors border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 shadow-lg opacity-70 hover:opacity-100"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {currentReviews.map((review, index) => (
            <div
              key={review._id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 review-card"
              onClick={() => handleReviewClick(review)}
            >
            {/* Top Section */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {index === 0 && (
                  <button className="text-gray-400 hover:text-gray-300 p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(review._id);
                  }}
                  className={`p-1 rounded transition-colors ${
                    likedReviews.has(review._id) 
                      ? 'text-blue-400' 
                      : 'text-gray-400 hover:text-blue-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDislike(review._id);
                  }}
                  className={`p-1 rounded transition-colors ${
                    dislikedReviews.has(review._id) 
                      ? 'text-red-400' 
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.333v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-3">
              <Rating rating={review.rating} size="sm" />
            </div>

            {/* Review Title */}
            <div className="mb-3">
              <h3 className="text-gray-900 dark:text-gray-200 font-semibold text-sm">
                "{getReviewTitle(review.comment)}"
              </h3>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                {review.user?.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/${review.user.avatar}`}
                    alt={review.user?.first_name || review.user?.username || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200 dark:border-gray-600 ${
                    review.user?.avatar ? 'hidden' : 'flex'
                  }`}
                >
                  {(review.user?.first_name?.charAt(0) || review.user?.username?.charAt(0) || 'U').toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-300 text-sm font-medium">
                  {review.user?.first_name && review.user?.last_name
                    ? `${review.user.first_name} ${review.user.last_name}`
                    : review.user?.username || 'Anonymous User'
                  }
                </p>
                <p className="text-gray-500 text-xs">
                  {formatTimeAgo(review.createdAt)}
                </p>
              </div>
            </div>

            {/* Review Content Preview */}
            <div className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
              {review.comment}
            </div>

            {/* Media Preview */}
            {review.media && (review.media.photos.length > 0 || review.media.videos.length > 0) && (
              <div className="mt-3">
                <div className="flex gap-2">
                  {review.media.photos.slice(0, 2).map((photo, photoIndex) => (
                    <div key={photoIndex} className="relative">
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/review-media/${photo.filename}`}
                        alt={`Preview ${photoIndex + 1}`}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                  
                  {review.media.videos.slice(0, 1).map((video, videoIndex) => (
                    <div 
                      key={videoIndex} 
                      className="relative cursor-pointer group"
                      onClick={(e) => handleVideoClick(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/review-media/${video.filename}`, e)}
                    >
                      <video
                        src={`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/review-media/${video.filename}`}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        preload="metadata"
                        onError={(e) => {
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white bg-opacity-80 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-all">
                          <svg className="w-2 h-2 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(review.media.photos.length + review.media.videos.length) > 3 && (
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-400 text-xs">
                        +{(review.media.photos.length + review.media.videos.length) - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      {/* Page Indicators */}
      {reviews.length > reviewsPerPage && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentPage(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              } ${index === currentPage && isAutoPlaying ? 'auto-play-indicator' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play Control */}
      {reviews.length > reviewsPerPage && (
        <div className="flex items-center justify-center mt-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
          >
            {isAutoPlaying ? '⏸️ Pause' : '▶️ Auto-play'}
          </button>
        </div>
      )}

      {/* Review Modal */}
      {isModalOpen && selectedReview && (
        <ReviewModal
          review={selectedReview}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLike={() => handleLike(selectedReview._id)}
          onDislike={() => handleDislike(selectedReview._id)}
          isLiked={likedReviews.has(selectedReview._id)}
          isDisliked={dislikedReviews.has(selectedReview._id)}
        />
      )}

      {/* Video Modal */}
      {isVideoModalOpen && selectedVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={handleCloseVideoModal}
          videoSrc={selectedVideo}
          videoTitle="Review Video"
        />
      )}
    </div>
  );
};

export default ReviewSlider;
