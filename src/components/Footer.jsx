import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className='bg-black text-white py-8'>
      <div className='container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        
        {/* Exclusive Section */}
        <div>
          <h3 className='font-bold mb-2  text-green-700'>e-SireMart</h3>
          <p className='hover:text-yellow-300 hover:cursor-pointer'>Subscribe</p>
          <p className='hover:text-yellow-300 hover:cursor-pointer'>Get 10% off your first order</p>
          <input 
            type='email' 
            placeholder='Enter your email' 
            className='mt-2 p-2 w-full rounded'
          />
        </div>

        {/* Support Section */}
        <div>
          <h3 className='font-bold mb-2  text-green-700'>Support</h3>
          <p className='hover:text-yellow-300 hover:cursor-pointer'>Real Estate Corporation - Warehouse No. 3 King of - Al Quoz Al - Al Quoz Industrial Area 4 - Dubai - United Arab Emirates</p>
          <p className='hover:text-yellow-300 hover:cursor-pointer'>info@e-siremart.com</p>
          <p className='hover:text-yellow-300 hover:cursor-pointer'>+(91)-704-295-9398</p>
        </div>

        {/* Account Section */}
        {/* <div>
          <h3 className='font-bold mb-2  text-green-700'>Account</h3>
          <ul>
            <li>My Account</li>
            <li>Login / Register</li>
            <li>Cart</li>
            <li>Wishlist</li>
            <li>Shop</li>
          </ul>
        </div> */}

        {/* Quick Link Section */}
        <div>
          <h3 className='font-bold mb-2 text-green-700'>Quick Link</h3>
          <ul>
            <li className='hover:text-yellow-300 hover:cursor-pointer'>Privacy Policy</li>
            <li className='hover:text-yellow-300 hover:cursor-pointer'>Terms Of Use</li>
            <li className='hover:text-yellow-300 hover:cursor-pointer'>FAQ</li>
            <li className='hover:text-yellow-300 hover:cursor-pointer'>AboutUs</li>
            <li className='hover:text-yellow-300 hover:cursor-pointer'>ContactUs</li>
          </ul>
        </div>

        {/* Download App Section */}
        <div>
          <h3 className='font-bold mb-2  text-green-700'>Download App</h3>
          <p className='hover:text-yellow-300 hover:cursor-pointer'>Save $3 with App New User Only</p>
          <div className='flex items-center gap-4 mt-2'>
            <img src='../src/assets/qr_code.png' alt='QR Code' className='w-16 h-16 hover:cursor-pointer' />
            <div>
              <img src='../src/assets/google_play.png' alt='Google Play' className='w-32 hover:cursor-pointer' />
              <img src='../src/assets/AppStore.png' alt='App Store' className='w-32 mt-2 hover:cursor-pointer' />
            </div>
          </div>
        <div className='col-span-full flex justify-start gap-4 mt-8 text-2xl'>
          <a href='#' className='hover:text-primary-100'><FaFacebook /></a>
          <a href='#' className='hover:text-primary-100'><FaTwitter /></a>
          <a href='#' className='hover:text-primary-100'><FaInstagram /></a>
          <a href='#' className='hover:text-primary-100'><FaLinkedin /></a>
        </div>
        </div>

        {/* Social Media Icons */}

        {/* Copyright Notice */}
        <div className='col-span-full text-center mt-4'>
          <p>© Copyright Rimel 2022. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;