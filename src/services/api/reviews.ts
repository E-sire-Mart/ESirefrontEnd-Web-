import { SERVER_URL } from '../url';
import { Review, ReviewResponse } from '../../utils/types';
import { getCurrentUserToken } from '../../utils/authUtils';

const API_BASE = `${SERVER_URL}/api/v1/reviews`;

// Get reviews for a specific product
export const getProductReviews = async (
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewResponse> => {
  const token = getCurrentUserToken();
  
  const response = await fetch(`${API_BASE}/product/${productId}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }

  return response.json();
};

// Create a new review
export const createReview = async (
  productId: string,
  rating: number,
  comment?: string,
  media?: { videos: any[]; photos: any[] }
): Promise<{ success: boolean; message: string; review: Review }> => {
  const token = getCurrentUserToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const requestBody = {
    productId,
    rating: Number(rating), // Ensure rating is a number
    comment,
    media: media || { videos: [], photos: [] },
  };
  
  console.log('Sending review request:', requestBody);
  
  const response = await fetch(`${API_BASE}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Review creation error:', errorData);
    throw new Error(errorData.message || 'Failed to create review');
  }

  return response.json();
};

// Update a review
export const updateReview = async (
  reviewId: string,
  rating?: number,
  comment?: string
): Promise<{ success: boolean; message: string; review: Review }> => {
  const token = getCurrentUserToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE}/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      rating: rating !== undefined ? Number(rating) : undefined,
      comment,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update review');
  }

  return response.json();
};

// Delete a review
export const deleteReview = async (
  reviewId: string
): Promise<{ success: boolean; message: string }> => {
  const token = getCurrentUserToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE}/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete review');
  }

  return response.json();
};

// Get user's reviews
export const getUserReviews = async (
  page: number = 1,
  limit: number = 10
): Promise<ReviewResponse> => {
  const token = getCurrentUserToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE}/user/my-reviews?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user reviews');
  }

  return response.json();
};