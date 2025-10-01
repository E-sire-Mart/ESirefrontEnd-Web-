import ChemistProducts from "../lib/data/products/chemistProducts.json";
import DairyProducts from "../lib/data/products/dairyProducts.json";
import SnacksProducts from "../lib/data/products/snacksProducts.json";
import {
  listProductsApi,
  ProductSearchPayload,
  getProductByIdApi,
} from "../services/api/products";
import {
  CartProduct,
  Category,
  ProductItem,
  ProductItemDetailed,
} from "./types";

const convertTextToURLSlug = (text: string): string => {
  const clearText = text.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, "").toLowerCase();
  return clearText.replace(/\s/g, "-");
};

const getCategoryLink = (category: Category): string => {
  const cat = convertTextToURLSlug(category.title);
  const sub = category.subcategories[0];
  const subcat = convertTextToURLSlug(sub.title);
  return `category/${cat}/${subcat}/${category.id}/${sub.id}`;
};

const shuffleItems = (unshuffled: any[] | undefined): any[] => {
  if (unshuffled === undefined) return [];
  let shuffled = unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return shuffled;
};

const getProductForCart = (product: ProductItem): any => {
  const { _id, name, price, image, shop } = product;
  return {
    id: _id.toString(),
    title: name,
    image: image[0] || "",
    price,
    shopId: typeof shop === 'string' ? shop : ((shop as any)?._id || (shop as any)?.id || ''),
  };
};

const getProducts = async (): Promise<any[]> => {
  const data: ProductSearchPayload = {
    searchText: "",
    shopId: "",
    category: "",
    nearby: false,
    page: 1,
    limit: 10,
  };
  const products = await listProductsApi(data);
  let productData: any[] = [];
  products.forEach((element: any) => {
    productData = [...productData, ...element.products];
  });

  return productData;
};

const getProductById = async (id: string | undefined) => {
  if (!id) return null;
  try {
    const product = await getProductByIdApi(id);
    return product || null;
  } catch (e) {
    console.error('getProductById failed, falling back to list:', e);
    const products = await getProducts();
    const fallback = products.find((item) => item._id === id);
    return fallback || null;
  }
};

// Discount calculation helper
const calculateDiscountedPrice = (price: number, discountPercent: number): number => {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.max(0, price * (1 - discountPercent / 100));
};

// Check if product has active discount
const hasActiveDiscount = (product: any): boolean => {
  if (!product.discountPercent || product.discountPercent <= 0) return false;
  
  // If no date restrictions, discount is active
  if (!product.startDate && !product.endDate) return true;
  
  const now = new Date();
  const startDate = product.startDate ? new Date(product.startDate) : null;
  const endDate = product.endDate ? new Date(product.endDate) : null;
  
  // Check if current time is within discount period
  if (startDate && now < startDate) return false;
  if (endDate && now > endDate) return false;
  
  return true;
};

export {
  convertTextToURLSlug,
  getCategoryLink,
  shuffleItems,
  getProductForCart,
  getProductById,
  calculateDiscountedPrice,
  hasActiveDiscount,
};
