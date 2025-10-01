import { SERVER_URL } from '../url';
import { getCurrentUserToken } from '../../utils/authUtils';

const API_BASE = `${SERVER_URL}/api/v1/review-media`;

// Upload review media (videos and photos)
export const uploadReviewMedia = async (
  reviewId: string,
  files: FileList
): Promise<{ success: boolean; media: any; message: string }> => {
  const token = getCurrentUserToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const formData = new FormData();
  
  // Add files to form data
  Array.from(files).forEach((file) => {
    formData.append('media', file);
  });

  const response = await fetch(`${API_BASE}/upload/${reviewId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload media');
  }

  return response.json();
};

// Delete individual media from review
export const deleteReviewMedia = async (reviewId: string, filename: string): Promise<{ success: boolean; message: string; media: any }> => {
  const token = getCurrentUserToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE}/delete/${reviewId}/${filename}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete media');
  }

  return response.json();
};

// Validate file before upload
export const validateReviewMedia = (files: FileList): { isValid: boolean; error?: string } => {
  const fileArray = Array.from(files);
  const videos = fileArray.filter(file => file.type.startsWith('video/'));
  const photos = fileArray.filter(file => file.type.startsWith('image/'));

  // Check video count
  if (videos.length > 1) {
    return { isValid: false, error: 'Only 1 video is allowed per review' };
  }

  // Check photo count
  if (photos.length > 10) {
    return { isValid: false, error: 'Maximum 10 photos allowed per review' };
  }

  // Check video size (100MB limit)
  const oversizedVideo = videos.find(video => video.size > 100 * 1024 * 1024);
  if (oversizedVideo) {
    return { isValid: false, error: 'Video file size must be less than 100MB' };
  }

  // Check photo size (10MB limit per photo)
  const oversizedPhoto = photos.find(photo => photo.size > 10 * 1024 * 1024);
  if (oversizedPhoto) {
    return { isValid: false, error: 'Photo file size must be less than 10MB' };
  }

  return { isValid: true };
};
