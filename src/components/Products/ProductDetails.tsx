import { useState } from "react";
import { IoCaretForwardSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getProductForCart } from "../../utils/helper";
import { allFeatures } from "../BrandPromotion";
import { AddToCartButton } from "../shared";
import Breadcrumb from "./Breadcrumb";
import ProductGallery from "./ProductGallery";
import ProductVarients from "./ProductVarients";

const ProductDetails = ({ product }: { product: any }) => {
  const allVarients = [product];
  const [itemIndex, setItemIndex] = useState<number>(0);
  const currentProduct = allVarients[itemIndex];
  const productAsCartItem = getProductForCart(currentProduct);

  return (
    <div className="relative grid lg:grid-cols-2 lg:border-b _border-muted -mt-2">
      <div className="lg:border-r _border-muted">
        <ProductGallery images={currentProduct.image} />
        <div className="text-[rgb(28,28,28)] text-2xl font-semibold leading-8 mt-8 mb-4">
          <h4 className="text-2xl font-bold _text-default">Product Details</h4>

          {/* <ProductInfoList {...currentProduct.attribute_collection} /> */}
        </div>
        <div className="h-max-content">
          <div className="mt-3 mb-3">
            <p className="text-[rgb(31,31,31)] text-sm font-semibold leading-4 capitalize mt-0 mb-2">
              <span>Product Description</span>
            </p>
            <div className="text-[rgb(102,102,102)] text-sm leading-4 break-words">
              {currentProduct.description}
            </div>
          </div>
          <div className="mt-3 mb-3">
            <p className="text-[rgb(31,31,31)] text-sm font-semibold leading-4 capitalize mt-0 mb-2">
              <span>Product Quantity</span>
            </p>
            <div className="text-[rgb(102,102,102)] text-sm leading-4 break-words">
              {currentProduct.quantity}
            </div>
          </div>
          <div className="mt-3 mb-3">
            <p className="text-[rgb(31,31,31)] text-sm font-semibold leading-4 capitalize mt-0 mb-2">
              <span>Product Price</span>
            </p>
            <div className="text-[rgb(102,102,102)] text-sm leading-4 break-words">
              {currentProduct.price}
            </div>
          </div>
          <div className="mt-3 mb-3">
            <p className="text-[rgb(31,31,31)] text-sm font-semibold leading-4 capitalize mt-0 mb-2">
              <span>Return Policy</span>
            </p>
            <div className="text-[rgb(102,102,102)] text-sm leading-4 break-words">
              You may return this item within 72 hours of buying it in case it
              is damaged or defective, or you have received an incorrect item In
              case of an incorrect item, you may raise a replacement or return
              request only if the item is sealed/ unopened/ unused and in
              original condition.
            </div>
          </div>
          <div className="mt-3 mb-3">
            <p className="text-[rgb(31,31,31)] text-sm font-semibold leading-4 capitalize mt-0 mb-2">
              <span>Customer Care Details</span>
            </p>
            <div className="text-[rgb(102,102,102)] text-sm leading-4 break-words">
              emails
            </div>
          </div>
          <div className="mt-3 mb-3">
            <p className="text-[rgb(31,31,31)] text-sm font-semibold leading-4 capitalize mt-0 mb-2">
              <span>Seller Name and PhonNumber</span>
            </p>
            <div className="text-[rgb(102,102,102)] text-sm leading-4 break-words">
              emails
            </div>
          </div>
          <div className="mt-3 mb-3">
            <p className="text-[rgb(31,31,31)] text-sm font-semibold leading-4 capitalize mt-0 mb-2">
              <span>Disclaimer</span>
            </p>
            <div className="text-[rgb(102,102,102)] text-sm leading-4 break-words">
              Every effort is made to maintain the accuracy of all information.
              However, actual product packaging and materials may contain more
              and/or different information. It is recommended not to solely rely
              on the information presented.
            </div>
          </div>
        </div>
      </div>
      <div className="static lg:block">
        <div className="relative top-0 lg:sticky lg:top-[100px]">
          <div className="px-4 lg:pl-12 lg:pt-8">
            <Breadcrumb {...currentProduct} />
            <h1 className="text-[28px] leading-tight py-3">
              {currentProduct.name}
            </h1>
            <Link to="/">
              <div className="cursor-pointer text-[#0c831f] font-semibold text-lg flex items-center">
                {currentProduct.brand}{" "}
                <IoCaretForwardSharp size={14} className="ml-0.5" />
                {currentProduct.name}&nbsp;( {currentProduct.category} )
              </div>
            </Link>
            <div className="mt-4 mb-6">
              <ProductVarients
                data={allVarients}
                onSelect={(e) => setItemIndex(e)}
              />
            </div>
            <div className="my-4 h-12 w-[130px]">
              <AddToCartButton size="lg" product={productAsCartItem} />
            </div>
            <div className="pb-4 hidden lg:block">
              <h4 className="font-bold _text-default text-[15px] py-3">
                Why shop from Bazaar?
              </h4>
              {allFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <div>
                    <img className="w-12 h-12" src={feat.imgSrc} alt="" />
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-black text-[13px]">{feat.text}</h5>
                    <p className="text-xs _text-muted">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
