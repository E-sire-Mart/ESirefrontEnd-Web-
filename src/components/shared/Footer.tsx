import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import AppStoreLogo from "../../assets/images/app-store.webp";
import PlayStoreLogo from "../../assets/images/play-store.webp";
import QrCodeImage from "../../assets/qr_code.png";
import { categoriesService, type Category } from "../../services/api/categories";
import "./Footer.css";

const Footer = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesService.getRootCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories for footer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answers: [
        "Browse our products, add items to cart, and proceed to checkout. Enter your delivery details and payment information to complete your order."
      ],
    },
    {
      question: "What are your delivery options?",
      answers: [
        "We offer standard delivery (2-3 business days) and express delivery (same day/next day) in select areas. Delivery fees vary by location and order value."
      ],
    },
    {
      question: "Can I return or exchange products?",
      answers: [
        "Yes, we accept returns within 7 days for most products. Items must be unused and in original packaging. Perishable goods have different return policies."
      ],
    },
    {
      question: "How do I track my order?",
      answers: [
        "You'll receive order confirmation and tracking updates via email and SMS. You can also track your order in your account dashboard."
      ],
    },
    {
      question: "What payment methods do you accept?",
      answers: [
        "We accept all major credit/debit cards, digital wallets, and cash on delivery. All online payments are secured with SSL encryption."
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Top Section - Company Info & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company & Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">e</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                SireMart
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted online marketplace for quality products. We bring convenience and reliability to your doorstep with our extensive range of products and exceptional service.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <p className="text-green-400 font-semibold text-sm">Subscribe for Updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-r-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 border-b border-green-500 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 border-b border-green-500 pb-2">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-green-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  Real Estate Corporation - Warehouse No. 3<br />
                  King of Al Quoz, Al Quoz Industrial Area 4<br />
                  Dubai, United Arab Emirates
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-green-400" />
                <a href="mailto:info@e-siremart.com" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  info@e-siremart.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-green-400" />
                <a href="tel:+917042959398" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  +(91) 704-295-9398
                </a>
              </div>
            </div>
          </div>

          {/* Download App Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 border-b border-green-500 pb-2">
              Download Our App
            </h3>
            <p className="text-gray-300 text-sm">
              Get exclusive app-only deals and save up to $3 on your first order!
            </p>
            <div className="space-y-3">
              <img
                src={PlayStoreLogo}
                alt="Google Play Store"
                className="w-32 hover:opacity-80 transition-opacity cursor-pointer"
              />
              <img
                src={AppStoreLogo}
                alt="Apple App Store"
                className="w-32 hover:opacity-80 transition-opacity cursor-pointer"
              />
            </div>
            <div className="text-center">
              <img
                src={QrCodeImage}
                alt="QR Code"
                className="w-16 h-16 mx-auto rounded-lg border-2 border-gray-600 hover:border-green-400 transition-colors cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">Scan to download</p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {!loading && categories.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Shop by Category
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 max-w-7xl mx-auto">
              {categories.slice(0, 21).map((category) => (
                <Link
                  key={category._id}
                  to={`/products/category/${category.slug || category.name}`}
                  className="group block p-3 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-center transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-gray-300 group-hover:text-green-400 font-medium text-sm transition-colors duration-200">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h3>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left text-white hover:bg-gray-700/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-semibold text-gray-100">{faq.question}</span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                    {openIndex === index ? (
                      <FaChevronUp className="text-green-400 w-4 h-4" />
                    ) : (
                      <FaChevronDown className="text-gray-300 w-4 h-4" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 animate-fadeIn">
                    <div className="pt-3 border-t border-gray-700">
                      {faq.answers.map((answer, idx) => (
                        <div
                          key={idx}
                          className="text-gray-300 leading-relaxed text-sm"
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

        {/* Bottom Section - Social Media & Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Media Links */}
            <div className="flex justify-center md:justify-start gap-6">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all duration-300">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all duration-300">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all duration-300">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all duration-300">
                <FaLinkedin className="text-lg" />
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} e-SireMart. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Made with ❤️ for our customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
