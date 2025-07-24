import React from "react";
import "./Loader.css"; // Ensure you include this CSS file
import ReactLoading from "react-loading";
const Loader = () => {
  return (
    <div className="w-full absolute h-full top-0 left-0 flex justify-center items-center">
      <div
        className="loader-container"
        style={{
          top: "0px",
          left: "0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          zIndex: "100",
        }}
      >
        <ReactLoading
          type="spinningBubbles"
          color="#15803d"
          height={120}
          width={60}
        />
      </div>
    </div>
  );
};

export default Loader;
