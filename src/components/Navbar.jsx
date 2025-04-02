import React, { useState } from "react";
import  {CategoriesDatas}  from "../common/categoriesData";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isSubcategoryDetailsVisible, setIsSubcategoryDetailsVisible] =
    useState(false);
  const [activeDetail, setActiveDetail] = useState(null);
  console.log(CategoriesDatas);
  
  return (
    <nav className="sticky bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 mx-auto lg:top-20 top-16 z-40 shadow-md flex justify-center items-center gap-1 w-full">
      <div className="container sticky w-full flex flex-wrap items-center justify-between">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          type="button"
          className="inline-flex items-center p-2 ms-3 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-800"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5 text-white" viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`${
            isNavOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row dark:bg-gray-900 dark:border-gray-700">
            <li
              className="relative"
              onMouseEnter={() => setIsCategoriesVisible(true)}
              onMouseLeave={() => setIsCategoriesVisible(false)}
            >
              <button className="flex items-center py-2 px-3 text-white hover:bg-gray-100 hover:text-black">
                All Categories
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {isCategoriesVisible && (
                <div className="absolute z-10 flex bg-white shadow-md">
                  <div className="w-[250px]">
                    <ul className="py-2 text-xs">
                      {CategoriesDatas.map((category, index) => (
                        <li
                          key={category.id}
                          className="relative"
                          onMouseEnter={() => setActiveCategory(index)}
                        >
                          <button className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 w-full">
                            {category.title}
                            {category.subcategory && category.subcategory.length > 0 && (
                              <svg
                                className="w-2.5 h-2.5 ms-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 9 4-4-4-4"
                                />
                              </svg>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {activeCategory !== null &&
                    CategoriesDatas[activeCategory]?.subcategory?.length > 0 && (
                      <div className="w-[230px] border-l">
                        <ul className="py-2 text-sm">
                          {CategoriesDatas[activeCategory].subcategory.map(
                            (subcategory, subIndex) => (
                              <li
                                key={`${CategoriesDatas[activeCategory].id}-${subIndex}`}
                                className="relative"
                                onMouseEnter={() =>
                                  setActiveSubcategory({
                                    activeCategory,
                                    subIndex,
                                  })
                                }
                              >
                                <button className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 w-full text-black">
                                  {subcategory.title}
                                  {subcategory.details?.length > 0 && (
                                    <svg
                                      className="w-2.5 h-2.5 ms-3"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 6 10"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 9 4-4-4-4"
                                      />
                                    </svg>
                                  )}
                                </button>
                                {activeSubcategory?.subIndex === subIndex &&
                                  activeSubcategory?.activeCategory === activeCategory &&
                                  subcategory.details?.length > 0 && (
                                    <div className="absolute left-full w-[230px] top-0 bg-white shadow-lg border-l">
                                      <ul className="py-2 text-sm">
                                        {subcategory.details.map((detail, index) => (
                                          <li
                                            key={`${CategoriesDatas[activeCategory].id}-${subIndex}-${index}`}
                                            className="px-4 py-2 hover:bg-gray-100"
                                          >
                                            {detail}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </li>
            <li className="cursor-pointer py-2 px-3 text-white hover:underline transition duration-700 ease-in-out">
              Perfume Fiesta
            </li>
            <li className="cursor-pointer py-2 px-3 text-white hover:underline transition duration-700 ease-in-out">
              Time Fest
            </li>
            <li className="cursor-pointer py-2 px-3 text-white hover:underline transition duration-700 ease-in-out">
              Clearance Sale
            </li>
            <li className="cursor-pointer py-2 px-3 text-white hover:underline transition duration-700 ease-in-out">
              Pre-Owned Products
            </li>
            <li className="cursor-pointer py-2 px-3 text-white hover:underline transition duration-700 ease-in-out">
              Saver Zone
            </li>
            <li className="cursor-pointer py-2 px-3 text-white hover:underline transition duration-700 ease-in-out">
              Deal of The Day
            </li>
            <li className="cursor-pointer py-2 px-3 text-white no-underline hover:underline hover:animate-bounce transition duration-700 ease-in-out">
              Top Selling Products
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
