type SubCategory = {
  id: number;
  title: string;
  image: string;
  icon?: string;
  subcategories?: InnerSubCategory[];
};

type InnerSubCategory = {
  id: number;
  title: string;
  image?: string;
};

export type Category = {
  id: number;
  title: string;
  image: string;
  color: string;
  icon?: string;
  subcategories: SubCategory[];
};

export type DiscountOffer = {
  button_cta_text: string;
  bank_name: string;
  subtitle: string;
  offer_color: string;
  bottomsheet_image_url: string;
  offer: {
    key: string;
    value: string;
  };
  text_color: string;
  content: {
    data: string[];
    heading: string;
  }[];
  bg_color: string;
  image_url: string;
  icon_url: string;
  title: string;
  deeplink: string;
};

export type ProductRow = {
  shopName: string;
  products: any[];
  shopId: string;
};
export interface ProductItem {
  product: any;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: any[];
  _id: string;
  startDate: string;
  endDate: string;
  shop: string;
  discountPercent: number;
}
interface LevelCategoryEntity {
  parent_id: number;
  level?: null;
  name: string;
  m_score?: null;
  id: number;
}
interface LeafCategory {
  parent_id: number;
  level: string;
  name: string;
  m_score?: null;
  id: number;
}
interface NextAvailableAt {
  next_available_ts: string;
  next_available_text: string;
}

export interface Attribute {
  title: string;
  url?: any;
  detail: string;
  value: string;
  help_text: string;
  type: string;
}

export interface AttributeCollection {
  attributes: Attribute[];
  title: string;
}

interface Value {
  mapping_id: number;
  selected: boolean;
  enabled: boolean;
  name: string;
  value?: any;
}

interface Option {
  values: Value[];
  type: number;
  title: string;
}

interface PidMapping {}

interface LevelCategory {
  id: number;
  name: string;
}

interface LeafCategory {
  id: number;
  name: string;
  level: string;
}

interface Reviews {
  reviews_list: any[];
  show_new_badge: boolean;
  title: string;
}

export interface ProductItemDetailed {
  rating: number;
  attribute_collection: AttributeCollection[];
  mrp: number;
  has_details: boolean;
  mapping_id: number;
  brand_id: number;
  merchant_type: string;
  sbc_price?: any;
  b2b_inventory: number;
  badges: any[];
  options: Option[];
  pid_mapping: PidMapping;
  derived_attributes?: any;
  pricing_comment: string;
  level1_category: LevelCategory[];
  unit_price: number;
  unit_type: string;
  rating_count: number;
  unit: string;
  line_1: string;
  line_2: string;
  type: string;
  brand: string;
  inventory: number;
  recommended_purchase_quantity?: any;
  offer: string;
  price: number;
  incentives: any[];
  user_message_limit: number;
  level0_category: LevelCategory[];
  rating_star_color: string;
  type_id: number;
  merchant_id: number;
  pl_flag: boolean;
  name: string;
  sbc_enabled: boolean;
  product_id: number;
  rating_count_text?: any;
  rating_flag: boolean;
  sbc_offer: string;
  leaf_category: LeafCategory;
  received_at_ts: number;
  reviews: Reviews;
  rating_text_color: string;
  image_url: string;
  sbc_unit_price: number;
  title: string;
  group_id: number;
  combo_flag?: any;
  sliding_images: string[];
}

export type CartProduct = {
  title: string;
  image?: string;
  price: number;
  id: string;
  subTitle: string;
  newPrice: number;
  mrp: number;
  shopId: string;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};
