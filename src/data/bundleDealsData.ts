export interface BundleDealItem {
  id: number;
  title: string;
  originalPrice: number;
  currentPrice: number;
  discount: string;
  image: string;
  badge?: string;
}

export const bundleDealsData: BundleDealItem[] = [
  {
    id: 1,
    title: "Beauty & Skincare Bundle Pack",
    originalPrice: 299,
    currentPrice: 199,
    discount: "33% OFF",
    image: "/assets/products/bundledeals/1.webp",
    badge: "HOT"
  },
  {
    id: 2,
    title: "Home & Kitchen Essentials",
    originalPrice: 199,
    currentPrice: 129,
    discount: "35% OFF",
    image: "/assets/products/bundledeals/2.webp",
    badge: "NEW"
  },
  {
    id: 3,
    title: "Electronics & Gadgets Bundle",
    originalPrice: 499,
    currentPrice: 349,
    discount: "30% OFF",
    image: "/assets/products/bundledeals/3.webp",
    badge: "BEST"
  }
];
