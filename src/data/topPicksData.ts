export interface TopPicksBanner {
  image: string;
  title: string;
  buttonText: string;
}

export interface TopPicksProduct {
  id: number;
  title: string;
  price: number;
  discount: number;
  image: string;
}

// 4 banners from public/assets/all_banners
export const topPicksBanners: TopPicksBanner[] = [
  { image: "/assets/all_banners/ai_haramain.jpg", title: "AI Haramain", buttonText: "Shop Now" },
  { image: "/assets/all_banners/casio-banner.png", title: "CASIO G-SHOCK", buttonText: "Shop Now" },
  { image: "/assets/all_banners/tv_baner.jpg", title: "Smart Choice TV", buttonText: "Order Now" },
  { image: "/assets/all_banners/home_applicaces.jpg", title: "Home Appliances", buttonText: "Order Now" },
];

// 32 products: 8 from each folder: Ai, casio, presign, tcl
export const topPicksProducts: TopPicksProduct[] = [
  // Ai (1..8)
  { id: 1, title: "AI 1", price: 199, discount: 25, image: "/assets/topPicks/Ai/1.webp" },
  { id: 2, title: "AI 2", price: 149, discount: 20, image: "/assets/topPicks/Ai/2.webp" },
  { id: 3, title: "AI 3", price: 299, discount: 30, image: "/assets/topPicks/Ai/3.webp" },
  { id: 4, title: "AI 4", price: 179, discount: 15, image: "/assets/topPicks/Ai/4.webp" },
  { id: 5, title: "AI 5", price: 269, discount: 22, image: "/assets/topPicks/Ai/5.webp" },
  { id: 6, title: "AI 6", price: 129, discount: 18, image: "/assets/topPicks/Ai/6.webp" },
  { id: 7, title: "AI 7", price: 189, discount: 12, image: "/assets/topPicks/Ai/7.webp" },
  { id: 8, title: "AI 8", price: 159, discount: 10, image: "/assets/topPicks/Ai/8.webp" },

  // Casio (1..8)
  { id: 9, title: "Casio 1", price: 114, discount: 25, image: "/assets/topPicks/casio/1.webp" },
  { id: 10, title: "Casio 2", price: 164, discount: 15, image: "/assets/topPicks/casio/2.webp" },
  { id: 11, title: "Casio 3", price: 164, discount: 15, image: "/assets/topPicks/casio/3.webp" },
  { id: 12, title: "Casio 4", price: 164, discount: 14, image: "/assets/topPicks/casio/4.webp" },
  { id: 13, title: "Casio 5", price: 236, discount: 20, image: "/assets/topPicks/casio/5.webp" },
  { id: 14, title: "Casio 6", price: 52, discount: 15, image: "/assets/topPicks/casio/6.webp" },
  { id: 15, title: "Casio 7", price: 52, discount: 15, image: "/assets/topPicks/casio/7.webp" },
  { id: 16, title: "Casio 8", price: 51, discount: 15, image: "/assets/topPicks/casio/8.webp" },

  // Presign (1..8)
  { id: 17, title: "Prestige 1", price: 280, discount: 25, image: "/assets/topPicks/presign/1.webp" },
  { id: 18, title: "Prestige 2", price: 204, discount: 25, image: "/assets/topPicks/presign/2.webp" },
  { id: 19, title: "Prestige 3", price: 269, discount: 25, image: "/assets/topPicks/presign/3.webp" },
  { id: 20, title: "Prestige 4", price: 150, discount: 25, image: "/assets/topPicks/presign/4.webp" },
  { id: 21, title: "Prestige 5", price: 399, discount: 25, image: "/assets/topPicks/presign/5.webp" },
  { id: 22, title: "Prestige 6", price: 525, discount: 25, image: "/assets/topPicks/presign/6.webp" },
  { id: 23, title: "Prestige 7", price: 65, discount: 25, image: "/assets/topPicks/presign/7.webp" },
  { id: 24, title: "Prestige 8", price: 170, discount: 15, image: "/assets/topPicks/presign/8.webp" },

  // TCL (1..8)
  { id: 25, title: "TCL 1", price: 549, discount: 25, image: "/assets/topPicks/tcl/1.webp" },
  { id: 26, title: "TCL 2", price: 499, discount: 41, image: "/assets/topPicks/tcl/2.webp" },
  { id: 27, title: "TCL 3", price: 999, discount: 35, image: "/assets/topPicks/tcl/3.webp" },
  { id: 28, title: "TCL 4", price: 1399, discount: 15, image: "/assets/topPicks/tcl/4.webp" },
  { id: 29, title: "TCL 5", price: 1999, discount: 17, image: "/assets/topPicks/tcl/5.webp" },
  { id: 30, title: "TCL 6", price: 525, discount: 25, image: "/assets/topPicks/tcl/6.webp" },
  { id: 31, title: "TCL 7", price: 1399, discount: 20, image: "/assets/topPicks/tcl/7.webp" },
  { id: 32, title: "TCL 8", price: 1899, discount: 17, image: "/assets/topPicks/tcl/8.webp" },
];
