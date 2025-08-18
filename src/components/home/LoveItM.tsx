import React from "react";
import tabbyBannerImage from "../../assets/asset/tabby_banner.jpg";

const LoveItM: React.FC = () => {
  return (
    <div className="w-full px-4 py-6">
      <div className="w-full" style={{ height: '147px' }}>
        <img
          src={tabbyBannerImage}
          alt="Tabby Banner"
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default LoveItM;
