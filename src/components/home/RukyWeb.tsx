import React from "react";
import rukyWebImage from "../../assets/asset/ruky_web.jpg";

const RukyWeb: React.FC = () => {
  return (
    <div className="w-full px-4 py-6">
      <div className="w-full">
        <img
          src={rukyWebImage}
          alt="Ruky Web"
          className="w-full h-auto object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default RukyWeb;
