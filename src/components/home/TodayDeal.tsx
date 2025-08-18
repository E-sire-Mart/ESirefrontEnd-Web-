import React from "react";
import todayDealImage from "../../assets/asset/today_deal_web.gif";

const TodayDeal: React.FC = () => {
  return (
    <div className="w-full px-4 py-6">
      <div className="w-full">
        <img
          src={todayDealImage}
          alt="Today's Deal"
          className="w-full h-auto object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default TodayDeal;
