"use client";

import axios from "axios";
import { LIST_PRODUCTS } from "../url.js";
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
    const { longitude, latitude }: any = await getLocation();
    
    const response = await axios.post(LIST_PRODUCTS, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-User-Longitude": longitude,
        "X-User-Latitude": latitude,
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
