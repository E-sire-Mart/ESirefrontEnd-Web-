import { BASE_URL } from '../url';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  level: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class CategoriesService {
  // Get all categories with tree structure
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch categories');
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      };
    }
  }

  // Get root categories (top-level categories)
  async getRootCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const url = `${BASE_URL}/categories/root`;
      console.log('🔍 Fetching root categories from:', url);
      console.log('🔍 BASE_URL:', BASE_URL);
      
      const response = await fetch(url);
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);
      
      const result = await response.json();
      console.log('🔍 Response data:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch categories');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error fetching root categories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch root categories',
      };
    }
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    try {
      const response = await fetch(`${BASE_URL}/categories/${id}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch category');
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch category',
      };
    }
  }
}

export const categoriesService = new CategoriesService(); 