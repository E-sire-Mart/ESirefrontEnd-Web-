import React from 'react';

const TopSeller = ({data}) => {


  return (
    <div className="first-carousel mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Top Selling</h2>
        <a href="#" className="text-blue-600">View All</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-red-300 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="w-1/2 h-full flex flex-col justify-start items-start gap-2">
                  <div className="text-xl font-bold text-white">AED {item.discountedPrice}</div>
                  <div className="text-white line-through text-sm">AED {item.originalPrice}</div>
                  <div className="text-white font-semibold">{item.discount}</div>
                  <h3 className="text-sm text-white line-clamp-2">{item.title}</h3>
                </div>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-1/2 h-full object-cover rounded"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSeller;