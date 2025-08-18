import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaChevronDown, FaChevronUp } from "react-icons/fa";
import AppStoreLogo from "../../assets/images/app-store.webp";
import PlayStoreLogo from "../../assets/images/play-store.webp";
import QrCodeImage from "../../assets/qr_code.png";
import Categories from "../../lib/data/categories.json";
import { getCategoryLink } from "../../utils/helper";
import "./Footer.css";

const Footer = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        "Personal information such as name, email, contact number, and address when you register or place an order. Payment details through secure, encrypted channels. Browsing data to improve your experience on our platform.",
        "How We Use Your Information: To process and deliver your orders. To communicate updates regarding your order and special offers. To improve our website, services, and customer experience.",
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
        "We want you to be completely satisfied with your purchase at e-Sire Mart. If you're not happy with a product, here's how we handle refunds and returns:",
        "Products must be returned within 7 days from the date of purchase. Items must be unused, in original packaging, and with proof of purchase. Perishable goods (e.g., fresh produce, dairy, etc.) unless they are damaged or expired upon delivery. Gift cards and other promotional items.",
        "Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed within 7 days to your original payment method.",
        "For more details on our refund process, please contact on: support@e-siremart.com.",
      ],
    },
    {
      question: "Terms and Conditions",
      answers: [
        "Welcome to e-Sire Mart. By accessing our website or mobile application, you agree to the following terms and conditions:",
        "You must be at least 18 years old to use our services. You agree to provide accurate, up-to-date information when creating an account or placing an order. Unauthorized use of our platform, including hacking or data theft, is strictly prohibited.",
        "All orders are subject to availability. We reserve the right to cancel or modify an order if an item is out of stock or if there are other unforeseen issues. Prices may vary and are subject to change without prior notice.",
        "e-Sire Mart is not liable for any indirect, incidental, or consequential damages arising from the use of our service. While we strive for accuracy, we cannot guarantee that all product descriptions, pricing, and availability will be error-free.",
        "By continuing to use our service, you agree to these terms. For more information or queries, please contact: support@e-siremart.com / 8625879347.",
      ],
    },
  ];

  const allCategories = Categories.map((cat) => ({
    id: cat.id,
    text: cat.title,
    link: getCategoryLink(cat),
  }));

  return (
    <footer className="bg-black text-white py-8 font-inter">
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company & Subscribe Section */}
          <div>
                         <h3 className="font-display font-700 mb-4 text-2xl text-green-500 tracking-wide">e-SireMart</h3>
                         <p className="text-gray-300 mb-2 hover:text-yellow-300 hover:cursor-pointer transition-colors font-500">
               Subscribe
             </p>
             <p className="text-gray-300 mb-3 hover:text-yellow-300 hover:cursor-pointer transition-colors font-500">
               Get 10% off your first order
             </p>
                         <input
               type="email"
               placeholder="Enter your email"
               className="mt-2 p-3 w-full rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors font-inter text-sm"
             />
          </div>

          {/* Support & Contact Section */}
          <div>
                         <h3 className="font-display font-600 mb-4 text-xl text-green-500 tracking-wide">Support</h3>
            <p className="text-gray-300 mb-3 hover:text-yellow-300 hover:cursor-pointer transition-colors text-sm leading-relaxed">
              Real Estate Corporation - Warehouse No. 3 King of - Al Quoz Al - Al Quoz Industrial Area 4 - Dubai - United Arab Emirates
            </p>
            <p className="text-gray-300 mb-2 hover:text-yellow-300 hover:cursor-pointer transition-colors">
              info@e-siremart.com
            </p>
            <p className="text-gray-300 mb-2 hover:text-yellow-300 hover:cursor-pointer transition-colors">
              +(91)-704-295-9398
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
                         <h3 className="font-display font-600 mb-4 text-xl text-green-500 tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li className="hover:text-yellow-300 hover:cursor-pointer transition-colors">
                Privacy Policy
              </li>
              <li className="hover:text-yellow-300 hover:cursor-pointer transition-colors">
                Terms Of Use
              </li>
              <li className="hover:text-yellow-300 hover:cursor-pointer transition-colors">
                FAQ
              </li>
              <li className="hover:text-yellow-300 hover:cursor-pointer transition-colors">
                About Us
              </li>
              <li className="hover:text-yellow-300 hover:cursor-pointer transition-colors">
                Contact Us
              </li>
            </ul>
          </div>

          {/* Download App Section */}
          <div>
                         <h3 className="font-display font-600 mb-4 text-xl text-green-500 tracking-wide">Download App</h3>
            <p className="text-gray-300 mb-3 hover:text-yellow-300 hover:cursor-pointer transition-colors">
              Save $3 with App New User Only
            </p>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={QrCodeImage}
                alt="QR Code"
                className="w-16 h-16 rounded-lg hover:cursor-pointer hover:opacity-80 transition-opacity"
              />
              <div className="space-y-2">
                <img
                  src={PlayStoreLogo}
                  alt="Google Play"
                  className="w-32 hover:cursor-pointer hover:opacity-80 transition-opacity"
                />
                <img
                  src={AppStoreLogo}
                  alt="App Store"
                  className="w-32 hover:cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
                     <h3 className="font-display font-700 mb-6 text-2xl text-green-500 text-center tracking-wide">Frequently Asked Questions</h3>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left text-white hover:bg-gray-800 transition-colors focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                                     <span className="font-display font-600 text-gray-100">{faq.question}</span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                    {openIndex === index ? (
                      <FaChevronUp className="text-gray-300 w-4 h-4" />
                    ) : (
                      <FaChevronDown className="text-gray-300 w-4 h-4" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <div className="pt-3 border-t border-gray-700">
                      {faq.answers.map((answer, idx) => (
                        <div
                          key={idx}
                          className="text-gray-300 leading-relaxed mb-3 last:mb-0"
                        >
                          {answer}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
                     <h3 className="font-display font-700 mb-6 text-2xl text-green-500 text-center tracking-wide">Shop by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group block p-3 rounded-lg bg-gray-900 border border-gray-700 hover:border-green-500 hover:bg-gray-800 transition-all duration-300 text-center"
              >
                                 <span className="text-gray-300 group-hover:text-green-400 font-inter font-500 text-sm transition-colors">
                   {cat.text}
                 </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex justify-center md:justify-start gap-6 text-2xl">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaLinkedin />
              </a>
            </div>
            
            <div className="text-center md:text-right">
                             <p className="text-gray-400 text-sm font-inter font-400">
                 © Copyright e-SireMart 2025. All rights reserved
               </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
