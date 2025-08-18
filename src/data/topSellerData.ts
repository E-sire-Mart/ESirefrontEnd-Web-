export interface TopSellerItem {
  id: number;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discount: string;
  image: string;
}

export const topSellerData: TopSellerItem[] = [
  {
    id: 1,
    title: "Children's Learning Activity Book",
    originalPrice: 89,
    discountedPrice: 59,
    discount: "34% OFF",
    image: "/assets/products/topseller/1.webp"
  },
  {
    id: 2,
    title: "Body Shaping Compression Garment",
    originalPrice: 199,
    discountedPrice: 129,
    discount: "35% OFF",
    image: "/assets/products/topseller/2.webp"
  },
  {
    id: 3,
    title: "Electronic Foot File Callus Remover",
    originalPrice: 149,
    discountedPrice: 99,
    discount: "33% OFF",
    image: "/assets/products/topseller/3.webp"
  },
  {
    id: 4,
    title: "Cat Ear Bluetooth Headphones",
    originalPrice: 299,
    discountedPrice: 199,
    discount: "33% OFF",
    image: "/assets/products/topseller/4.webp"
  }
];
