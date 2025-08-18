import React from 'react';

interface TopSellerItem {
  id: number;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discount: string;
  image: string;
}

interface TopSellerProps {
  data: TopSellerItem[];
}

const TopSeller: React.FC<TopSellerProps> = ({ data }) => {
  return (
    <div className="first-carousel mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Top Selling</h2>
        <a href="#" className="text-blue-600">View All</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="w-1/2 h-full flex flex-col justify-start items-start gap-2">
                  <div className="text-xl font-bold text-white">AED {item.discountedPrice}</div>
                  <div className="text-gray-300 line-through text-sm">AED {item.originalPrice}</div>
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold px-2 py-1 rounded-full text-xs">{item.discount}</div>
                  <h3 className="text-sm text-gray-100 line-clamp-2">{item.title}</h3>
                </div>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-1/2 h-full object-cover rounded-lg shadow-lg"
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
