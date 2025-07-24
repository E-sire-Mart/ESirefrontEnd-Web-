import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AppStoreLogo from "../../assets/images/app-store.webp";
import PlayStoreLogo from "../../assets/images/play-store.webp";
import Categories from "../../lib/data/categories.json";
import { getCategoryLink } from "../../utils/helper";
import React, { useState } from "react";
import "./Footer.css"; // Importing CSS styles

const faqs = [
  {
    question: "About Us",
    answers: [
      "Welcome to e-Sire Mart e-commerce private limited, your one-stop destination for your products or services, e.g., groceries, essentials, electronics, etc., delivered to your doorstep with speed and convenience. Founded with a vision to simplify your shopping experience, we are committed to providing high-quality products, competitive prices, and exceptional customer service.",
      "At e-Sire Mart, we believe in making everyday life easier by offering an efficient, user-friendly experience. We work with trusted brands and local suppliers to ensure our products are fresh, reliable, and of the highest standard. Your satisfaction is our priority, and we strive to make every order seamless and enjoyable.",
      "Thank you for choosing e-Sire Mart. We look forward to serving you!",
    ],
  },
  {
    question: "Privacy Policy",
    answers: [
      "At e-Sire Mart, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you interact with our website or mobile application.",
      <ul className="list-style">
        <li>
          Personal information such as name, email, contact number, and address
          when you register or place an order.
        </li>
        <li>Payment details through secure, encrypted channels.</li>
        <li>Browsing data to improve your experience on our platform.</li>
      </ul>,
      "How We Use Your Information:",
      <ul className="list-style">
        <li>To process and deliver your orders.</li>
        <li>To communicate updates regarding your order and special offers.</li>
        <li>To improve our website, services, and customer experience.</li>
      </ul>,
      "We do not sell or share your personal information with third parties, except as necessary to fulfill your order (such as delivery partners). Your data is protected with industry-standard security protocols.",
      "For more details, please contact on: support@e-siremart.com.",
    ],
  },
  {
    question: "Shipping Policy",
    answers: [
      "We currently deliver to your city. You can check delivery availability by entering your zip code at checkout.",
      "Orders are typically processed within processing time. For express delivery, items may arrive within 1 hour in selected areas.",
      "We make every effort to ensure timely deliveries. However, during peak seasons or unforeseen circumstances, slight delays may occur. If you have any questions or concerns, feel free to contact us.",
    ],
  },
  {
    question: "Refund Policy",
    answers: [
      "We want you to be completely satisfied with your purchase at e-Sire Mart. If you’re not happy with a product, here’s how we handle refunds and returns:",
      <ul className="list-style">
        <li>
          Products must be returned within 7 days from the date of purchase.
        </li>
        <li>
          Items must be unused, in original packaging, and with proof of
          purchase.
        </li>
        <li>
          Perishable goods (e.g., fresh produce, dairy, etc.) unless they are
          damaged or expired upon delivery.
        </li>
        <li>Gift cards and other promotional items.</li>
      </ul>,
      "Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed within 7 days to your original payment method.",
      "For more details on our refund process, please contact on: support@e-siremart.com.",
    ],
  },
  {
    question: "Terms and Conditions",
    answers: [
      "Welcome to e-Sire Mart. By accessing our website or mobile application, you agree to the following terms and conditions:",
      <ul className="list-style">
        <li>You must be at least 18 years old to use our services.</li>
        <li>
          You agree to provide accurate, up-to-date information when creating an
          account or placing an order.
        </li>
        <li>
          Unauthorized use of our platform, including hacking or data theft, is
          strictly prohibited.
        </li>
        <li>
          All orders are subject to availability. We reserve the right to cancel
          or modify an order if an item is out of stock or if there are other
          unforeseen issues.
        </li>
        <li>Prices may vary and are subject to change without prior notice.</li>
      </ul>,
      "e-Sire Mart is not liable for any indirect, incidental, or consequential damages arising from the use of our service. While we strive for accuracy, we cannot guarantee that all product descriptions, pricing, and availability will be error-free.",
      "By continuing to use our service, you agree to these terms. For more information or queries, please contact: support@e-siremart.com / 8625879347.",
    ],
  },
];

type BrandLink = {
  text: string;
  link: string;
};

const Footer = () => {
  const allCategories = Categories.map((cat) => ({
    id: cat.id,
    text: cat.title,
    link: getCategoryLink(cat),
  }));

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer>
      <div className="max-w-[80rem] mx-auto pb-[50px]">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-4 text-left text-lg font-medium focus:outline-none"
              onClick={() => toggleAccordion(index)}
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div>
                {faq.answers.map((answer, idx) => (
                  <div
                    key={idx}
                    className="faq-answer px-4 py-2 text-gray-600 text-sm"
                  >
                    {answer}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="_container space-y-6">
        <div className="flex flex-col md:flex-row gap-4 pb-2">
          <div>
            <h4 className="font-bold my-4 text-lg leading-none lg:mr-4">
              Categories
            </h4>
            <div className="flex flex-wrap gap-y-1">
              {allCategories.map((cat) => (
                <div
                  className="cursor-pointer text-[15px] _text-default xs:w-[25%] w-[50%]"
                  key={cat.id}
                >
                  <Link to={cat.link}>{cat.text}</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:w-[50%] w-[100%]">
            <h4 className="font-bold my-4 text-lg leading-none lg:mr-4">
              Contact Us
            </h4>
            <div className="flex flex-wrap gap-y-1 flex-col">
              <div className="text-[15px] _text-default w-[100%]">
                <div className="flex flex-row py-1 items-center">
                  <FaMapMarkerAlt />
                  <p className="w-full ml-1">
                    Address : Belandur, Bengaluru – 560035
                  </p>
                </div>
                <div className="flex flex-row py-1 items-center">
                  <FaPhone />
                  <p className="w-full ml-1">Call : +(91)-704-295-9398</p>
                </div>
                <div className="flex flex-row py-1 items-center">
                  <FaEnvelope />
                  <p className="w-full ml-1">
                    Email : support@e-siremart.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#fcfcfc] py-6 mt-2 min-h-[60px]">
        <div className="_container">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
            <div className="text-xs flex-1 _text-muted lg:max-w-md pr-6">
              e-Sire Mart eCommerce Private Limited @Copyright 2024-25.
            </div>
            <div className="flex flex-1 md:flex-row items-center gap-2">
              <h4 className="font-bold text-md leading-none lg:mr-4 _text-default">
                Download App
              </h4>
              <div className="h-8 w-24 rounded-[3px] cursor-pointer overflow-hidden">
                <img
                  src={AppStoreLogo}
                  alt="App store"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-8 w-24 rounded-[3px] cursor-pointer overflow-hidden">
                <a
                  href="https://play.google.com/apps/testing/com.e-Sire Mart.customer"
                  target="_blank"
                >
                  <img
                    src={PlayStoreLogo}
                    alt="Play store"
                    className="h-full w-full object-cover"
                  />
                </a>
              </div>
            </div>
            <div className="flex-1 flex items-center md:justify-end gap-4 lg:gap-6">
              <div className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <FaFacebookF />
              </div>
              <div className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <FaTwitter />
              </div>
              <div className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <FaInstagram />
              </div>
              <div className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <FaLinkedinIn />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
