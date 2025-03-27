import React from "react";
import { useState, useEffect, useRef } from "react";

const ListsCarousel = ({ listData, preferWord }) => {
  return (
    <>
      <div
        className="overflow-x-scroll scrollbar-hide relative px-0.5 pt-5 w-full m-auto categories-lists"
        style={{ overflowY: "hidden" }}
      >
        <div
          className="flex snap-x snap-mandatory lg:gap-5 gap-4"
          style={{ width: "max-content" }}
        >
          {listData.map((card) => (
            <div
              key={card.id}
              className="flex-none md:w-[120px] w-[90px] snap-center b-10 cursor-pointer"
            >
              <div className="overflow-hidden">
                <img
                  src={card.image ? card.image : ""}
                  alt={card.title ? card.title : ""}
                  className="lg:h-[120px] h-[90px] px-[5px] object-cover md:rounded-[50%] rounded-[49%] bg-gradient-to-r from-violet-600 to-indigo-600"
                />
                <div className="p-2">
                  <h3 className="md:text-[14px] text-[9px] text-gray-900 text-center w-full">
                    {card.title ? card.title : ""}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    {card.description ? card.description : ""}
                  </p>
                  {preferWord == "" ? (
                    <></>
                  ) : (
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-extrabold text-gray-900">
                        ${card.price.toFixed(2) ? card.price.toFixed(2) : ""}
                      </span>
                      <a
                        href={card.link}
                        className="text-white bg-fuchsia-950 hover:bg-fuchsia-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListsCarousel;
