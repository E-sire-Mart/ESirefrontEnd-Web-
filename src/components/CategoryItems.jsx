import React from 'react';
import { Link } from 'react-router-dom';

const CategoryItems = ({ title, data }) => {
  return (
    <div className="first-carousel mx-auto px-4 my-8 ">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      
      <div className="bg-customBlue bg-opacity-40 rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {data.map((item) => (
            <Link 
              to={item.link} 
              key={item.id}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryItems;
