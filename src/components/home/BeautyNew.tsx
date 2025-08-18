import React from "react";
import beautyNewImage from "../../assets/asset/beauty-new.jpg";

const BeautyNew: React.FC = () => {
	return (
		<div className="w-full px-4 py-6">
			<div className="w-full">
				<img
					src={beautyNewImage}
					alt="Beauty New"
					className="w-full h-auto object-contain rounded-lg shadow-lg"
				/>
			</div>
		</div>
	);
};

export default BeautyNew;
