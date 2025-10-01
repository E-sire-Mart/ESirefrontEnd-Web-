import { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CarouselButtonGroup from '../CarouselButtonGroup';
import { ProductItemDetailed } from '../../utils/types';
import { calculateDiscountedPrice, hasActiveDiscount } from '../../utils/helper';

const responsive = {
  lgdesktop: {
    breakpoint: { max: 1920, min: 1440 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 1440, min: 992 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 992, min: 600 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 2,
  },
};

type Props = {
  data: ProductItemDetailed[];
  onSelect: (arg: number) => void;
};

const VarientItem = ({
  data,
  onSelect,
}: {
  data: any;
  onSelect: () => void;
}) => {
  const isDiscountActive = hasActiveDiscount(data);
  const discountedPrice = calculateDiscountedPrice(data.price, data.discountPercent || 0);
  
  return (
    <div
      onClick={() => onSelect()}
      className={`rounded-lg max-w-[150px] border overflow-hidden leading-none ${
        data.selected ? 'border-[#b1dc9c]' : '_border-muted dark:border-gray-700'
      } ${
        data.out_of_stock
          ? 'bg-gray-50 dark:bg-gray-800 pointer-events-none'
          : 'bg-white dark:bg-gray-700 cursor-pointer'
      }`}
    >
      <div className="py-2 px-3 flex items-center">
        <div className="w-8 pl-1">
          <input type="radio" checked={data.selected} readOnly />
        </div>
        <div>
          <p className="font-bold text-[15px] text-gray-900 dark:text-gray-100">{data.unit}</p>
          {data.out_of_stock ? (
            <span className="text-[10px] text-red-500">Out of stock</span>
          ) : (
            <div className="text-xs text-gray-700 dark:text-gray-200">
              {isDiscountActive ? (
                <div>
                  <div className="text-red-600 font-bold">AED {discountedPrice.toFixed(0)}</div>
                  <del className="opacity-80 text-gray-400 dark:text-gray-400">AED {data.price.toFixed(0)}</del>
                  <div className="text-[10px] text-red-600 font-bold">{data.discountPercent}% OFF</div>
                </div>
              ) : (
                <span>AED {data.price.toFixed(0)}</span>
              )}
            </div>
          )}
        </div>
      </div>
      {data.selected && data.offer && (
        <div className="text-[11px] text-center font-bold bg-[#ecffec] dark:bg-green-900/20 border-t border-[#b1dc9c] dark:border-green-700 text-[#54b226] dark:text-green-300 py-2 px-3">
          {data.offer}
        </div>
      )}
    </div>
  );
};

const ProductVarients = ({ data, onSelect }: Props) => {
  const varientList = data.map((item) => {
    const { product_id, price, mrp, unit, offer, inventory } = item;
    return {
      product_id,
      price,
      mrp,
      unit,
      offer,
      out_of_stock: inventory === 0,
    };
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const handleVarientChange = (e: number) => {
    setCurrentIndex(() => e);
    onSelect(e);
  };

  return (
    <div className="h-full flex items-center">
      <div className="relative w-full flex-1 max-w-[400px] md:max-w-[500px] mx-4 lg:-ml-2">
        <Carousel
          swipeable={false}
          draggable={false}
          responsive={responsive}
          arrows={false}
          renderButtonGroupOutside={true}
          customButtonGroup={<CarouselButtonGroup />}
          shouldResetAutoplay={false}
          infinite={false}
          itemClass="mx-2"
        >
          {varientList.map((varient, i) => (
            <VarientItem
              key={`var-${i}`}
              data={{ ...varient, selected: currentIndex === i }}
              onSelect={() => handleVarientChange(i)}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductVarients;
