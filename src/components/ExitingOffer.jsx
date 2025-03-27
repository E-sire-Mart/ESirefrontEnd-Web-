import React, { useRef } from "react";

const newsItems = [
  {
    title: "Dr. Abdullah Abdullah's Presidential Election Campaign",
    category: "Politics",
    date: "25",
    month: "May",
    image:
      "https://media.gettyimages.com/photos/at-the-the-network-tolo-televised-debate-dr-abdullah-abdullah-with-picture-id1179614034?k=6&m=1179614034&s=612x612&w=0&h=WwIX3RMsOQEn5DovD9J3e859CZTdxbHHD3HRyrgU3A8=",
  },
  {
    title: "Afghanistan's President Ashraf Ghani Speaks At The Council",
    category: "Politics",
    date: "10",
    month: "Mar",
    image:
      "https://media.gettyimages.com/photos/ashraf-ghani-afghanistans-president-speaks-at-the-council-on-foreign-picture-id850794338?k=6&m=850794338&s=612x612&w=0&h=b_XBw5S38Cioslqr6VL3e36cWQU205IsInqDXZpDOD4=",
  },
  {
    title: "Middle East Participants Gather In Warsaw",
    category: "Politics",
    date: "20",
    month: "Jan",
    image:
      "https://media.gettyimages.com/photos/afghan-president-ashraf-ghani-arrives-to-the-welcoming-ceremony-the-picture-id694155252?k=6&m=694155252&s=612x612&w=0&h=IIJPetzJL-hAgPkE4hm2wUKvO4YOav8jJp484CgLEUs=",
  },
  {
    title: "Afghan President Ashraf Ghani Visits Jalalabad",
    category: "Politics",
    date: "25",
    month: "May",
    image:
      "https://media.gettyimages.com/photos/afghan-president-ashraf-ghani-speaks-during-a-gathering-in-jalalabad-picture-id1205021905?k=6&m=1205021905&s=612x612&w=0&h=nwAH1XuZxF_H4f6LfHv-lgqtZe0h1tVFXfzhpMwFqao=",
  },
  {
    title: "Afghan President Ashraf Ghani Visits Jalalabad",
    category: "Politics",
    date: "25",
    month: "May",
    image:
      "https://media.gettyimages.com/photos/afghan-president-ashraf-ghani-speaks-during-a-gathering-in-jalalabad-picture-id1205021905?k=6&m=1205021905&s=612x612&w=0&h=nwAH1XuZxF_H4f6LfHv-lgqtZe0h1tVFXfzhpMwFqao=",
  },
];

const ExitingOffer = () => {
  const carouselRef = useRef(null);
  const itemWidth = 320; // Adjust width as needed

  const scrollLeft = () => {
    if (carouselRef.current.scrollLeft === 0) {
      carouselRef.current.scrollTo({
        left: newsItems.length * itemWidth,
        behavior: "instant",
      });
    }
    carouselRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (
      carouselRef.current.scrollLeft + carouselRef.current.clientWidth >=
      carouselRef.current.scrollWidth
    ) {
      carouselRef.current.scrollTo({ left: 0, behavior: "instant" });
    } else {
      carouselRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto p-5 sm:p-10 md:p-16 relative first-carousel">
      <p className="">Exiting Offer</p>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-5 md:left-20 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 z-10"
        >
          ◀
        </button>

        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="relative flex-none w-80 h-[250px] bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
              <div className="absolute top-0 right-0 left-0 mx-5 mt-2 flex justify-between items-center">
                <span className="text-xs bg-indigo-600 text-white px-5 py-2 uppercase hover:bg-white hover:text-indigo-600 transition">
                  {item.category}
                </span>
                <div className="text-white flex flex-col">
                  <span className="text-3xl font-semibold">{item.date}</span>
                  <span className="-mt-3">{item.month}</span>
                </div>
              </div>
              <div className="p-5 absolute bottom-0">
                <a href="#" className="text-md text-white hover:underline">
                  {item.title}
                </a>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-5 md:right-20 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 z-10"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default ExitingOffer;
