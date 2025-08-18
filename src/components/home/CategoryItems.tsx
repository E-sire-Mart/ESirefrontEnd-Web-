import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryItem {
  id: number | string;
  title: string;
  image: string; // public URL e.g. /assets/category/laptopsCom/1.jpg
  link?: string;
}

interface CategoryItemsProps {
  title: string;
  data: CategoryItem[];
}

const CategoryItems: React.FC<CategoryItemsProps> = ({ title, data }) => {
  return (
    <div className="first-carousel mx-auto px-4 my-8 ">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      
      <div className="bg-[#d6ecf5] rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {data.map((item) => {
            const Wrapper: any = item.link ? Link : 'div';
            const wrapperProps = item.link ? { to: item.link } : {};
            return (
              <Wrapper
                key={item.id}
                {...wrapperProps}
                className="bg-white rounded-lg p-4 transition-transform hover:scale-105"
              >
                <div className="aspect-square relative mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xs sm:text-sm text-center text-gray-700 line-clamp-2">
                  {item.title}
                </h3>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryItems;
