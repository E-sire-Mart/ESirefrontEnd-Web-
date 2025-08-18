export interface BrandProduct {
  id: number;
  title: string;
  salePrice: number;
  originalPrice: number;
  discount: string;
  brand: string;
  model: string;
  image: string;
}

export const brandsOfWeekData: BrandProduct[] = [
  { id: 1, title: "Watch 1", salePrice: 160, originalPrice: 200, discount: "20%", brand: "Ducati", model: "DX-01", image: "/assets/watches/1.webp" },
  { id: 2, title: "Watch 2", salePrice: 145, originalPrice: 180, discount: "19%", brand: "Ducati", model: "DX-02", image: "/assets/watches/2.webp" },
  { id: 3, title: "Watch 3", salePrice: 129, originalPrice: 160, discount: "19%", brand: "Ducati", model: "DX-03", image: "/assets/watches/3.webp" },
  { id: 4, title: "Watch 4", salePrice: 189, originalPrice: 230, discount: "18%", brand: "Ducati", model: "DX-04", image: "/assets/watches/4.webp" },
];
