import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import Rating from './Rating';
import { Review as ReviewType, ReviewResponse } from '../../utils/types';
import { getProductReviews, createReview, updateReview, deleteReview } from '../../services/api/reviews';
import { uploadReviewMedia, validateReviewMedia, deleteReviewMedia } from '../../services/api/reviewMedia';
import ReviewSlider from './ReviewSlider';

interface ReviewProps {
  productId: string;
  currentUserId?: string;
  onReviewSubmit?: () => void;
}

const Review: React.FC<ReviewProps> = ({ productId, currentUserId, onReviewSubmit }) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [userReview, setUserReview] = useState<ReviewType | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response: ReviewResponse = await getProductReviews(productId, page, 10);
      
      if (page === 1) {
        setReviews(response.reviews);
      } else {
        setReviews(prev => [...prev, ...response.reviews]);
      }
      
      setRatingStats(response.ratingStats);
      setHasMore(response.pagination.hasNext);
      
      // Check if current user has a review
      const currentUserReview = response.reviews.find(review => review.user._id === currentUserId);
      if (currentUserReview) {
        setUserReview(currentUserReview);
        setUserRating(currentUserReview.rating);
        setUserComment(currentUserReview.comment);
      } else {
        // Important: reset when navigating to a product without user's review
        setUserReview(null);
        setUserRating(0);
        setUserComment('');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const validation = validateReviewMedia(files);
      if (!validation.isValid) {
        notification.error({
          message: "Invalid Files",
          description: validation.error,
          placement: "topRight",
          duration: 4,
        });
        return;
      }
      setSelectedFiles(files);
    }
  };

  const handleDeleteMedia = async (filename: string) => {
    if (!userReview) return;
    
    try {
      await deleteReviewMedia(userReview._id, filename);
      notification.success({
        message: "Media Deleted",
        description: "Media has been deleted successfully.",
        placement: "topRight",
        duration: 2,
      });
      
      // Refresh reviews to update the display
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting media:', error);
      notification.error({
        message: "Failed to Delete Media",
        description: "Unable to delete media. Please try again.",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      notification.warning({
        message: "Rating Required",
        description: "Please select a rating before submitting your review.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    try {
      setSubmitting(true);
      
      if (userReview) {
        // Update existing review
        await updateReview(userReview._id, userRating, userComment);
        
        // Upload media if files are selected for existing review
        if (selectedFiles && selectedFiles.length > 0) {
          setUploadingMedia(true);
          try {
            await uploadReviewMedia(userReview._id, selectedFiles);
            notification.success({
              message: "Review Updated",
              description: "Your review and media have been updated successfully.",
              placement: "topRight",
              duration: 2,
            });
          } catch (mediaError) {
            console.error('Error uploading media:', mediaError);
            notification.warning({
              message: "Review Updated, Media Failed",
              description: "Review updated but media upload failed. Please try uploading media again.",
              placement: "topRight",
              duration: 4,
            });
          } finally {
            setUploadingMedia(false);
          }
        } else {
          notification.success({
            message: "Review Updated",
            description: "Your review has been updated successfully.",
            placement: "topRight",
            duration: 2,
          });
        }
      } else {
        // Create new review first
        const newReviewResponse = await createReview(productId, userRating, userComment, { videos: [], photos: [] });
        
        // Upload media if files are selected for new review
        if (selectedFiles && selectedFiles.length > 0) {
          setUploadingMedia(true);
          try {
            await uploadReviewMedia(newReviewResponse.review._id, selectedFiles);
            notification.success({
              message: "Review Submitted",
              description: "Thank you for your review and media! They have been submitted successfully.",
              placement: "topRight",
              duration: 2,
            });
          } catch (mediaError) {
            console.error('Error uploading media:', mediaError);
            notification.warning({
              message: "Review Submitted, Media Failed",
              description: "Review submitted but media upload failed. Please try uploading media again.",
              placement: "topRight",
              duration: 4,
            });
          } finally {
            setUploadingMedia(false);
          }
        } else {
          notification.success({
            message: "Review Submitted",
            description: "Thank you for your review! It has been submitted successfully.",
            placement: "topRight",
            duration: 2,
          });
        }
      }
      
      // Refresh reviews
      setPage(1);
      await fetchReviews();
      setShowReviewForm(false);
      setSelectedFiles(null);
      onReviewSubmit?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      notification.error({
        message: "Failed to Submit Review",
        description: "Unable to submit your review. Please try again.",
        placement: "topRight",
        duration: 3,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        await deleteReview(userReview._id);
        setUserReview(null);
        setUserRating(0);
        setUserComment('');
        setPage(1);
        await fetchReviews();
        onReviewSubmit?.();
        notification.success({
          message: "Review Deleted",
          description: "Your review has been deleted successfully.",
          placement: "topRight",
          duration: 2,
        });
      } catch (error) {
        console.error('Error deleting review:', error);
        notification.error({
          message: "Failed to Delete Review",
          description: "Unable to delete your review. Please try again.",
          placement: "topRight",
          duration: 3,
        });
      }
    }
  };

  const loadMoreReviews = () => {
    setPage(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 _section-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold">{ratingStats.averageRating.toFixed(1)}</div>
            <div>
              <Rating rating={ratingStats.averageRating} size="lg" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Based on {ratingStats.totalReviews} review{ratingStats.totalReviews !== 1 ? 's' : ''}
              </p>
              {!currentUserId && (
                <p className="text-xs text-orange-300 mt-1">
                  ⚠️ Log in to add reviews
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              if (!currentUserId) {
                notification.warning({
                  message: "Login Required",
                  description: "You need to be logged in to write a review. Please log in to continue.",
                  placement: "topRight",
                  duration: 4,
                });
                return;
              }
              setShowReviewForm(!showReviewForm);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {userReview ? 'Edit Review' : 'Add Review'}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && currentUserId && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg _section-card">
          <h3 className="text-lg font-semibold mb-4">
            {userReview ? 'Edit Your Review' : 'Add a Review'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Rating *
              </label>
              <Rating
                rating={userRating}
                interactive={true}
                onRatingChange={setUserRating}
                size="lg"
              />
            </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                 Comment
               </label>
               <textarea
                 value={userComment}
                 onChange={(e) => setUserComment(e.target.value)}
                 placeholder="Share your experience with this product..."
                 className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                 rows={4}
                 maxLength={1000}
               />
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                 {userComment.length}/1000 characters
               </p>
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                 Add Photos & Videos (Optional)
               </label>
               
               {/* Display existing media if updating review */}
               {userReview && userReview.media && (userReview.media.photos.length > 0 || userReview.media.videos.length > 0) && (
                 <div className="mb-4">
                   <p className="text-sm text-gray-600 mb-2">Current media:</p>
                   <div className="grid grid-cols-4 gap-2">
                     {/* Display existing photos */}
                     {userReview.media.photos.map((photo, index) => (
                       <div key={`existing-photo-${index}`} className="relative group">
                         <img
                           src={`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/review-media/${photo.filename}`}
                           alt={`Existing photo ${index + 1}`}
                           className="w-full h-20 object-cover rounded-lg border border-gray-300"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.style.display = 'none';
                           }}
                         />
                         <button
                           onClick={() => handleDeleteMedia(photo.filename)}
                           className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                           title="Delete photo"
                         >
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                         </button>
                         <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                           Photo
                         </div>
                       </div>
                     ))}
                     
                     {/* Display existing videos */}
                     {userReview.media.videos.map((video, index) => (
                       <div key={`existing-video-${index}`} className="relative group">
                         <video
                           src={`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/review-media/${video.filename}`}
                           className="w-full h-20 object-cover rounded-lg border border-gray-300"
                           onError={(e) => {
                             const target = e.target as HTMLVideoElement;
                             target.style.display = 'none';
                           }}
                         />
                         <button
                           onClick={() => handleDeleteMedia(video.filename)}
                           className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                           title="Delete video"
                         >
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                         </button>
                         <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                           <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                             <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                           </svg>
                         </div>
                         <div className="absolute bottom-1 left-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded">
                           Video
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
               
               <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
                 <input
                   type="file"
                   multiple
                   accept="image/*,video/*"
                   onChange={handleFileChange}
                   className="hidden"
                   id="review-media-upload"
                 />
                 <label
                   htmlFor="review-media-upload"
                   className="cursor-pointer flex flex-col items-center justify-center text-center"
                 >
                   <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                   </svg>
                   <span className="text-sm text-gray-600">
                     Click to upload photos and videos
                   </span>
                   <span className="text-xs text-gray-500 mt-1">
                     Up to 10 photos and 1 video (max 100MB)
                   </span>
                 </label>
                 
                 {selectedFiles && selectedFiles.length > 0 && (
                   <div className="mt-3">
                     <p className="text-sm text-gray-700 mb-2">Selected files:</p>
                     <div className="space-y-1">
                       {Array.from(selectedFiles).map((file, index) => (
                         <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                           <span className="text-sm text-gray-600 truncate flex-1">
                             {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                           </span>
                           <button
                             type="button"
                             onClick={() => setSelectedFiles(null)}
                             className="text-red-500 hover:text-red-700 ml-2"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                           </button>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitReview}
                disabled={submitting || uploadingMedia || userRating === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploadingMedia ? 'Uploading Media...' : submitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              {userReview && (
                <button
                  onClick={handleDeleteReview}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Review
                </button>
              )}
            </div>
          </div>
        </div>
      )}

       {/* Reviews Slider */}
       <ReviewSlider 
         productId={productId} 
         currentUserId={currentUserId}
       />
    </div>
  );
};

export default Review;