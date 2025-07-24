import React from "react";

const BundleDeals = ({ data }) => {

    return (
        <div className="first-carousel mx-auto px-4 my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bundle Deals</h2>
                <a href="#" className="text-blue-600">View All</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map((item, index) => (
                    <div key={index} className="bg-customBlue bg-opacity-70 rounded-lg overflow-hidden relative">
                        <div className="p-6">
                            {item.badge && (
                                <div className="absolute top-4 left-4 bg-customGreen text-white rounded-full text-sm px-3 py-1">
                                    {item.badge}
                                </div>
                            )}
                            <div className="flex justify-between items-start gap-3">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-1/2 h-28 object-contain"
                                />
                                <div className="flex-1">
                                    <div className="text-xl font-bold mb-4">
                                        <span className="text-sm text-white">AED</span> {item.currentPrice}
                                    </div>
                                    <div className="text-gray-600 line-through text-sm">
                                        <span className="text-xs text-white">AED</span> {item.originalPrice}
                                    </div>
                                    <div className="text-purple-700 font-semibold text-white mt-1">{item.discount}</div>
                                    <h3 className="text-sm text-gray-700 line-clamp-2 text-white">{item.title}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BundleDeals;
