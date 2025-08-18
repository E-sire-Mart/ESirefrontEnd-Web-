import React from 'react';

export interface PopularProduct {
	id: number | string;
	name: string;
	image: string;
	currentPrice: number;
	originalPrice?: number;
}

const ProductCard: React.FC<{ product: PopularProduct }> = ({ product }) => {
	const discountPercentage = product.originalPrice
		? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
		: 0;

	return (
		<div className="bg-white p-4 rounded-lg shadow group hover:shadow-xl transition-all duration-300 relative">
			{/* Product Image Container */}
			<div className="relative h-48 mb-4 overflow-hidden">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
				/>
				{discountPercentage > 0 && (
					<span className="absolute top-2 left-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full shadow">
						{discountPercentage}% OFF
					</span>
				)}

				{/* Quick View Button - Hidden by default, shown on hover */}
				<div className="absolute bg-black inset-0 bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<button
						className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white px-4 py-2 cursor-pointer rounded-full text-sm font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow"
						onClick={() => {}}
					>
						Quick View
					</button>
				</div>
			</div>

			{/* Product Details */}
			<div className="space-y-2">
				<h3 className="text-sm text-gray-700 line-clamp-2 h-10 group-hover:text-[#ff4747] transition-colors duration-300">
					{product.name}
				</h3>

				<div className="flex items-center gap-2">
					<span className="text-[#ff4747] font-semibold">AED {product.currentPrice}</span>
					{product.originalPrice && (
						<span className="text-gray-500 text-sm line-through">AED {product.originalPrice}</span>
					)}
				</div>
			</div>

			{/* Add to Cart Button - Hidden by default, shown on hover */}
			<div className="absolute bottom-0 left-0 right-0 p-4 bg-white opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
				<button className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white py-2 rounded text-sm font-medium cursor-pointer shadow" onClick={() => {}}>
					ADD TO CART
				</button>
			</div>
		</div>
	);
};

interface PopularProductsProps {
	type: string;
	data: PopularProduct[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({ type, data }) => {
	return (
		<div className="mx-auto py-8 px-5 first-carousel">
			<div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-800 shadow-xl">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
						{type}
					</h2>
					<button className="text-white/90 hover:text-white underline-offset-2 hover:underline cursor-pointer">View All</button>
				</div>

				{/* Products Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
					{data.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
};

export default PopularProducts;
