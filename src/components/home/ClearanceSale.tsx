import React from "react";
import clearanceSaleImage from "../../assets/asset/clearance_sale.gif";

const ClearanceSale: React.FC = () => {
	return (
		<div className="w-full px-4 py-6">
			<div className="w-full">
				<img
					src={clearanceSaleImage}
					alt="Clearance Sale"
					className="w-full h-auto object-contain rounded-lg shadow-lg"
				/>
			</div>
		</div>
	);
};

export default ClearanceSale;
