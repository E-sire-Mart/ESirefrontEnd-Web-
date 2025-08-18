// Import all slider images from the home_sliders directory
import slider1 from '../assets/home_sliders/1.jpg';
import slider2 from '../assets/home_sliders/2.webp';
import slider3 from '../assets/home_sliders/3.jpg';
import slider4 from '../assets/home_sliders/4.gif';
import slider5 from '../assets/home_sliders/5.jpg';
import slider6 from '../assets/home_sliders/6.webp';
import slider7 from '../assets/home_sliders/7.jpg';
import slider8 from '../assets/home_sliders/8.gif';
import slider9 from '../assets/home_sliders/9.jpg';
import slider10 from '../assets/home_sliders/10.jpg';

export interface CarouselItem {
  src: string;
  alt: string;
  name?: string;
}

export const carouselData: CarouselItem[] = [
  {
    src: slider1,
    alt: "Special Offer 1",
    name: "Special Offer 1"
  },
  {
    src: slider2,
    alt: "Special Offer 2",
    name: "Special Offer 2"
  },
  {
    src: slider3,
    alt: "Special Offer 3",
    name: "Special Offer 3"
  },
  {
    src: slider4,
    alt: "Special Offer 4",
    name: "Special Offer 4"
  },
  {
    src: slider5,
    alt: "Special Offer 5",
    name: "Special Offer 5"
  },
  {
    src: slider6,
    alt: "Special Offer 6",
    name: "Special Offer 6"
  },
  {
    src: slider7,
    alt: "Special Offer 7",
    name: "Special Offer 7"
  },
  {
    src: slider8,
    alt: "Special Offer 8",
    name: "Special Offer 8"
  },
  {
    src: slider9,
    alt: "Special Offer 9",
    name: "Special Offer 9"
  },
  {
    src: slider10,
    alt: "Special Offer 10",
    name: "Special Offer 10"
  }
];
