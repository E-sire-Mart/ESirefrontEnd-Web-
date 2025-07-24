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
    <section>
      <div className="flex items-center justify-between h-16">
        <h2 className="font-bold text-[26px] _text-default">{shopName}</h2>
        {/* Add any additional logic or actions related to the shop */}
        <div
          style={{ fontSize: "20px", fontWeight: "bold", color: "#15803d", cursor: "pointer" }}
          onClick={() => {
            handleSeeAll(shopId);
          }}
        >
          See all
        </div>
      </div>
      <ItemsCarousel items={products} />
    </section>
  );
};

export default ProductsRow;
