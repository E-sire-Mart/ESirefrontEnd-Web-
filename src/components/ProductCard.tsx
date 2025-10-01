import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertTextToURLSlug, calculateDiscountedPrice, hasActiveDiscount } from "../utils/helper";
import { CartProduct, ProductItemWithRating } from "../utils/types";
import AddToCartButton from "./shared/AddToCartButton";
import Rating from "./shared/Rating";
import { SERVER_URL } from "../services/url";

const ProductCard = ({ data }: { data: ProductItemWithRating }) => {
  const navigate = useNavigate();
  const {
    name = "",
    description = "",
    price = 0,
    image = [],
    _id = "",
    startDate,
    endDate,
    discountPercent = 0,
    shop,
    averageRating = 0,
    totalReviews = 0,
    totalRecommendations = 0
  } = data || {};
  const [discountStatus, setDiscountStatus] = useState<boolean>(false);
  const [cartProduct, setCartProduct] = useState<CartProduct>({
    id: _id || "",
    title: name || "",
    subTitle: description || "",
    image: image[0] || "",
    price: price || 0,
    newPrice: 0,
    mrp: 0,
    shopId: shop
  });

  useEffect(() => {
    const isDiscountActive = hasActiveDiscount(data);
    const discountedPrice = calculateDiscountedPrice(price, discountPercent);
    
    setDiscountStatus(isDiscountActive);
    setCartProduct((prevProduct) => ({
      ...prevProduct,
      newPrice: isDiscountActive ? discountedPrice : price,
    }));
  }, [discountPercent, price, data]);

  const handleProductClick = () => {
    const pname = convertTextToURLSlug(name);
    navigate({
      pathname: `/prn/${pname}/prid/${_id}`,
    });
  };

  return (
    <div
      className="_card relative flex cursor-pointer mb-2 mx-auto sm:mx-0 w-[172px] h-[268px] xs:w-[180px] xs:h-[272px] sm:w-[190px] sm:h-[280px] md:w-[200px] md:h-[290px]"
      onClick={handleProductClick}
    >
      {discountPercent > 0 && (
        <div className="absolute bg-red-500 text-white px-3 py-1 text-xs font-medium -left-[1px] top-4 rounded-tr-xl rounded-br-xl uppercase">
          {discountPercent}% OFF
        </div>
      )}
      <div className="h-[145px] xs:h-[150px] sm:h-[154px] w-154px">
        <img
          src={`${SERVER_URL}/${image[0]}`}
          alt={name}
          className="h-full w-full p-2 object-cover"
          onError={(e) => {
            // Fallback to a placeholder image if the image fails to load
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='154' height='154' viewBox='0 0 154 154'%3E%3Crect width='154' height='154' fill='%23f0f0f0'/%3E%3Ctext x='77' y='77' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
      <div
        className="overflow-hidden text-left flex flex-col mt-auto"
        style={{ margin: "0" }}
      >
        <div
          className="_text-default dark:text-white font-semibold leading-tight line-clamp-2 mb-0.5 text-[14px] sm:text-[16px]"
          style={{
            display: "flex",
            marginTop: "5px",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: "bold",
            overflow: "hidden", // Ensures content outside the box is hidden
            textOverflow: "ellipsis", // Displays ... at the end of overflowing text
            whiteSpace: "nowrap", // Prevents text from wrapping onto multiple lines
            maxWidth: "250px", // Sets a maximum width for the text container
          }}
        >
          {name.length > 13 ? `${name.slice(0, 13)}...` : name}
        </div>

        <div
          className="_text-default dark:text-gray-200 text-[12px] sm:text-[13px] font-medium leading-tight line-clamp-2 mb-0.5"
          style={{
            display: "flex",
            marginTop: "5px",
            justifyContent: "flex-start",
            alignItems: "center",
            overflow: "hidden", // Ensures content outside the box is hidden
            textOverflow: "ellipsis", // Displays ... at the end of overflowing text
            whiteSpace: "nowrap", // Prevents text from wrapping onto multiple lines
            maxWidth: "250px", // Sets a maximum width for the text container
          }}
        >
          {description}
        </div>

        {/* Rating and Recommendations */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            {averageRating > 0 && (
              <div className="flex items-center space-x-1">
                <Rating rating={averageRating} size="sm" />
                <span className="text-xs text-gray-600">({totalReviews})</span>
              </div>
            )}
          </div>
          {totalRecommendations > 0 && (
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-green-600">{totalRecommendations}</span>
            </div>
          )}
        </div>

        <div
          className="flex items-center justify-between mt-auto"
          style={{ marginTop: "5px" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {discountStatus && (
              <span
                className="text-[13px] sm:text-[14px] _text-default dark:text-white"
                style={{ fontWeight: "bold" }}
              >
                AED {cartProduct.newPrice.toFixed(0)}
              </span>
            )}
            <span
              className={
                discountStatus
                  ? `text-[12px] _text-default dark:text-gray-400 text-decoration-line: line-through`
                  : `text-[13px] sm:text-[14px] _text-default dark:text-white`
              }
              style={{ color: discountStatus ? "#9c9c9c" : undefined }}
            >
              AED {cartProduct.price.toFixed(0)}
            </span>
          </div>
          <div className="h-9 w-[88px] sm:w-[90px]">
            <AddToCartButton product={cartProduct} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
