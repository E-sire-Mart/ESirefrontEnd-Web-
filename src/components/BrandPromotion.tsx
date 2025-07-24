import { IoCheckmarkCircle } from "react-icons/io5";
import AppStoreLogo from "../assets/images/app-store.webp";
import PlayStoreLogo from "../assets/images/play-store.webp";
import Feat1 from "../assets/images/promo-feat-1.webp";
import Feat2 from "../assets/images/promo-feat-2.avif";
import Feat3 from "../assets/images/promo-feat-3.png";
import Feat4 from "../assets/images/promo-feat-4.png";

type Feature = {
  imgSrc: string;
  text: string;
  description: string;
};

export const allFeatures: Feature[] = [
  {
    imgSrc: Feat1,
    text: "Superfast/Quick Delivery",
    description:
      "Get your order delivered to your doorstep at the earliest from stores near you.",
  },
  {
    imgSrc: Feat2,
    text: "Best Deals & Offers",
    description:
      " Same products in cheaper rates by availing great cashback offers",
  },
  {
    imgSrc: Feat3,
    text: "Broad Assortment",
    description:
      "Choose from 100+ products across food, personal care, household & other categories",
  },
  {
    imgSrc: Feat4,
    text: "Smooth Return & Refund Policy",
    description:
      "Didn’t like the product? Return it at the doorstep & get refunded within same day",
  },
];

const PromoFeature = (props: Feature) => {
  return (
    <div className="_border border rounded-2xl p-8 flex flex-col items-center gap-3">
      <img className="w-[100px] h-[100px] mb-4" src={props.imgSrc} alt="" />
      <h5 className="text-black font-bold text-sm text-center">{props.text}</h5>
      <p className="text-xs _text-default text-center">{props.description}</p>
    </div>
  );
};

const BrandPromotion = () => {
  return (
    <section className="py-6 mt-8">
      <div className="_container">
        <div className="flex flex-col gap-8 lg:border-t _border-muted lg:pt-2">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 items-start gap-2 sm:gap-4 xl:gap-10 mt-6">
            {allFeatures.map((feat, i) => (
              <PromoFeature key={i} {...feat} />
            ))}
          </div>
          <div className="border-b _border-light pt-2 pb-10">
            <p className="text-sm _text-default">
              "“e-Sire Mart”" is owned & managed by "“e-Sire Mart eCommerce
              Private Limited" and is not related, linked or interconnected with
              any other business service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandPromotion;
