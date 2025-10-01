"use client";

import axios from "axios";
import { LIST_PRODUCTS, LIST_DISCOUNTED_PRODUCTS } from "../url.js";
import { getLocation } from "../globalfunctions.js";

export interface ProductSearchPayload {
  searchText: string;
  shopId?: string;
  category: string;
  nearby: boolean;
  page: number;
  limit: number;
}

export const listProductsApi = async (payload: ProductSearchPayload) => {
  try {
    const response = await axios.post(LIST_PRODUCTS, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.products;
  } catch (error: any) {
    console.error(
      "Error in sending request: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getProductByIdApi = async (id: string) => {
  try {
    // LIST_PRODUCTS is BASE_URL/product/products; so base is .../product
    const base = LIST_PRODUCTS.replace(/\/products$/, "");
    const response = await axios.get(`${base}/${id}`);
    return response.data?.product;
  } catch (error: any) {
    console.error("Error fetching product by id:", error.response?.data || error.message);
    throw error;
  }
};

export const listDiscountedProductsApi = async () => {
  try {
    const response = await axios.get(LIST_DISCOUNTED_PRODUCTS);
    return response.data.products;
  } catch (error: any) {
    console.error("Error fetching discounted products:", error.response?.data || error.message);
    throw error;
  }
};