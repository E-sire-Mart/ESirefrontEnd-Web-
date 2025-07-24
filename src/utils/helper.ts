import ChemistProducts from "../lib/data/products/chemistProducts.json";
import DairyProducts from "../lib/data/products/dairyProducts.json";
import SnacksProducts from "../lib/data/products/snacksProducts.json";
import {
  listProductsApi,
  ProductSearchPayload,
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
  const { _id, name, price, image } = product;
  return {
    id: _id.toString(),
    title: name,
    image: image[0] || "",
    price,
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
  if (id) {
    const products = await getProducts();
    const product = products.filter((item) => item._id === id)[0];
    return product || null;
  }
};

export {
  convertTextToURLSlug,
  getCategoryLink,
  shuffleItems,
  getProductForCart,
  getProductById,
};
