import React, { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa"; // Download icon
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation
import firstHeder from "../../assets/images/ad-1.png";
import secondHeder from "../../assets/images/ad-small-1.png";
import icon from "../../assets/images/ad-small-2.png";
import image from "../../assets/images/ad-21.png";
import ExitingOffer from "./ExitingOffer";
import TodayDeal from "./TodayDeal";
const HeroArea: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState<boolean>(
    window.innerWidth <= 639
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 639);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full space-y-4 mt-3 px-4">
      {!isMobileView && (
        <>
          <div>
            <a
              href="https://play.google.com/apps/testing/com.e-Sire Mart.customer"
              target="_blank"
            >
              {/* "https://play.google.com/apps/testing/com.e-Sire Mart.customer */}
              <img src={image} alt="Clickable Image" style={{ borderRadius: "15px" }} />
            </a>
          </div>
          <div style={{ borderRadius: "20px" }}>
            <img src={firstHeder} />
          </div>
        </>
      )}

      {isMobileView && (
        <>
          <div style={{ borderRadius: "20px" }}>
            <img src={secondHeder} />
          </div>
          <div>
            <a
              href="https://play.google.com/apps/testing/com.e-Sire Mart.customer"
              target="_blank"
            >
              <img src={icon} alt="Clickable Image" />
            </a>
          </div>
        </>
      )}
      
      <ExitingOffer />
      <TodayDeal />
    </div>
  );
};

export default HeroArea;
