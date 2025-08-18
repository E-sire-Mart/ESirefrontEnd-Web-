"use client";

import { useEffect, useState } from "react";
import {
  CategoriesList,
  DiscountOffers,
  FeaturedPromo,
  HeroArea,
  HighlightedPromo,
  ProductsRow,
  CarouselComponent,
  DealsAndSavers,
  RukyWeb,
  MobilePhones,
  LoveItM,
  PromotionalBanners,
  TopSeller,
  BundleDeals,
  TopPicks,
  BeautyNew,
  ClearanceSale,
  BrandsOfWeek,
  CategoryItems,
  PopularProducts,
} from "../components/home";
import {
  listProductsApi,
  ProductSearchPayload,
} from "../services/api/products.js";
import { ProductRow } from "../utils/types";
import { carouselData } from "../data/carouselData";
import { topSellerData } from "../data/topSellerData";
import { bundleDealsData } from "../data/bundleDealsData";
import { topPicksBanners, topPicksProducts } from "../data/topPicksData";
import { brandsOfWeekData } from "../data/brandsOfWeekData";
import { laptopsComItems } from "../data/categoryItemsData";
import {
  LaptopsComsData,
  HomeEssentialsData,
  GamingCompsData,
  HealthBeautyData,
  BabyMothersData,
  EyewareWatchesData,
  AutomotiveData,
  HomeFurnitureData,
  ToolsHardwareData,
} from "../data/multiCategoryData";
import {
  Sunglasses,
  Games,
  MobilePhones as PopularMobiles,
  Laptops as PopularLaptops,
  GamingPcComponents,
  SmartWatchAccessories,
  TelevisionAccessories,
  Bicycle,
  Cookware,
  StorageOrganization,
  GlasswareDrinkware,
  FitnessAccessories,
  Perfumes,
  SmartWatches,
  FoodPreparationKitchenwares,
} from "../data/popularProductsData";

const Home = ({searchText}: any) => {

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data: ProductSearchPayload = {
        searchText: searchText,
        shopId: "",
        category: "",
        nearby: false,
        page: 1,
        limit: 50,
      };
      try {
        const response = await listProductsApi(data); // Await the promise
        
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts(); // Call the async function to fetch products
  }, [searchText]);

  return (
    <div style={{overflowX:'hidden'}}>
      <CarouselComponent data={carouselData} />
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1496px' }}>
        <HeroArea />
        <DealsAndSavers />
        <RukyWeb />
        <MobilePhones />
        <LoveItM />
        <PromotionalBanners />
        <TopSeller data={topSellerData} />
        <TopPicks bannerDatas={topPicksBanners} topPicksDatas={topPicksProducts} />
        <FeaturedPromo />
        <BeautyNew />
        <BundleDeals data={bundleDealsData} />
        <BrandsOfWeek data={brandsOfWeekData} />
        <ClearanceSale />
        <CategoryItems title="Laptops & Computers" data={LaptopsComsData} />
        <CategoryItems title="Home Essentials" data={HomeEssentialsData} />
        <CategoryItems title="Gaming & Consoles" data={GamingCompsData} />
        <CategoryItems title="Health & Beauty" data={HealthBeautyData} />
        <CategoryItems title="Baby & Mothers" data={BabyMothersData} />
        <CategoryItems title="Eyeware & Watches" data={EyewareWatchesData} />
        <CategoryItems title="Automotive" data={AutomotiveData} />
        <CategoryItems title="Home Furniture" data={HomeFurnitureData} />
        <CategoryItems title="Tools & Hardware" data={ToolsHardwareData} />

        <PopularProducts type="Sunglasses" data={Sunglasses} />
        <PopularProducts type="Games" data={Games} />
        <PopularProducts type="Mobile Phones" data={PopularMobiles} />
        <PopularProducts type="Laptops" data={PopularLaptops} />
        <PopularProducts type="Gaming PC Components" data={GamingPcComponents} />
        <PopularProducts type="Smart Watch & Accessories" data={SmartWatchAccessories} />
        <PopularProducts type="Television & Accessories" data={TelevisionAccessories} />
        <PopularProducts type="Bicycle" data={Bicycle} />
        <PopularProducts type="Cookware" data={Cookware} />
        <PopularProducts type="Storage & Organization" data={StorageOrganization} />
        <PopularProducts type="Glassware & Drinkware" data={GlasswareDrinkware} />
        <PopularProducts type="Perfumes" data={Perfumes} />
        <PopularProducts type="Smart Watches" data={SmartWatches} />
        <CategoriesList />
        {/* <DiscountOffers /> */}
        <HighlightedPromo />
        {products.map((shopProduct: ProductRow, i) => (
          <ProductsRow
            key={i}
            shopName={shopProduct.shopName}
            shopId={shopProduct.shopId}
            products={shopProduct.products}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
