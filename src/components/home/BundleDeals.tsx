import React from "react";

interface BundleDealItem {
	id: number;
	title: string;
	originalPrice: number;
	currentPrice: number;
	discount: string;
	image: string;
	badge?: string;
}

interface BundleDealsProps {
	data: BundleDealItem[];
}

const BundleDeals: React.FC<BundleDealsProps> = ({ data }) => {
	return (
		<div className="first-carousel mx-auto px-4 my-8">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Bundle Deals</h2>
				<a href="#" className="text-emerald-600 hover:text-teal-700 font-semibold transition-colors duration-300">View All</a>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{data.map((item, index) => (
					<div key={index} className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-xl overflow-hidden relative shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<div className="p-6">
							{item.badge && (
								<div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm px-3 py-1 font-semibold shadow-lg">
									{item.badge}
								</div>
							)}
							<div className="flex justify-between items-start gap-3">
								<img
									src={item.image}
									alt={item.title}
									className="w-1/2 h-28 object-contain rounded-lg shadow-md"
								/>
								<div className="flex-1">
									<div className="text-xl font-bold mb-4">
										<span className="text-sm text-white opacity-90">AED</span> {item.currentPrice}
									</div>
									<div className="text-white line-through text-sm opacity-75">
										<span className="text-xs text-white opacity-90">AED</span> {item.originalPrice}
									</div>
									<div className="bg-white/20 backdrop-blur-sm text-white font-semibold mt-2 px-2 py-1 rounded-full text-xs inline-block">{item.discount}</div>
									<h3 className="text-sm text-white line-clamp-2 mt-2 font-medium">{item.title}</h3>
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
