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
    <div className="relative rounded-2xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-7 flex flex-col items-center gap-3 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* soft accent blob */}
      <div className="absolute -top-16 -right-8 w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-100 to-pink-100 dark:from-indigo-900/20 dark:to-pink-900/20 blur-2xl opacity-60" />

      <div className="relative w-24 h-24 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
        <img className="w-16 h-16 object-contain" src={props.imgSrc} alt="" />
      </div>

      <h5 className="text-center text-base font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
        {props.text}
      </h5>
      <p className="text-center text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {props.description}
      </p>
    </div>
  );
};

const BrandPromotion = () => {
  return (
    <section className="py-10 mt-8">
      <div className="_container">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 items-stretch gap-4 sm:gap-6 xl:gap-10">
            {allFeatures.map((feat, i) => (
              <PromoFeature key={i} {...feat} />
            ))}
          </div>
          <div className="pt-2 pb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              "e-Sire Mart" is owned & managed by "e-Sire Mart eCommerce Private
              Limited" and is not related, linked or interconnected with any
              other business service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandPromotion;
