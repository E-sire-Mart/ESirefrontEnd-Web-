import { useNavigate } from "react-router-dom";
import { ProductRow } from "../../utils/types";
import ItemsCarousel from "../shared/ItemsCarousel";

const ProductsRow = ({ shopName, shopId, products }: ProductRow) => {
  const navigate = useNavigate();

  const handleSeeAll = (shopId: string) => {
    navigate({
      pathname: `/products/shop/${shopId}`,
    });
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between h-14 sm:h-16 px-1 sm:px-0">
        <h2 className="_text-default font-extrabold text-[18px] sm:text-[22px] md:text-[26px] tracking-tight">
          {shopName}
        </h2>
        <button
          className="text-emerald-700 hover:text-emerald-800 text-sm sm:text-base font-semibold transition-colors"
          onClick={() => handleSeeAll(shopId)}
          type="button"
        >
          See all
        </button>
      </div>
      <ItemsCarousel items={products} />
    </section>
  );
};

export default ProductsRow;
