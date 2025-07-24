import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useParams } from "react-router-dom";
import NotAvailable from "../components/NotAvailable";
import { ProductDetails } from "../components/Products";
import { getProductById } from "../utils/helper";
const ProductView: React.FC = () => {
  const { id } = useParams();

  console.log(id,"------------------")
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const productFound = await getProductById(id);
        if (productFound) {
          setProduct(productFound);
        } else {
          setProduct(null);
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          background:'white',
          zIndex: "100",
        }}
      >
        <ReactLoading
          type="spinningBubbles"
          color="#15803d"
          height={120}
          width={60}
        />
      </div>
    ); // You can replace this with a loader component if you have one
  }

  if (!product) {
    window.scrollTo(0, 0);
    return <NotAvailable />;
  }

  return (
    <div className="_container">
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductView;
