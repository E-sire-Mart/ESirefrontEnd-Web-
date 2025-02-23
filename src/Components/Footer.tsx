"use client";

import Link from "next/link";
import Image from "next/image";
import { AiOutlineSend } from "react-icons/ai";
import { HiOutlineQrcode } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="flex flex-col flex-wrap justify-between items-center w-full bg-black text-white py-14">
      <div className="flex flex-wrap justify-between gap-6 w-full mb-6 px-[7%]">
        {/* Subscribe Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[1.3rem] mb-3">Exclusive</h2>
          <h3 className="text-md">Subscribe</h3>
          <p className="text-sm">Get 10% off your first order</p>
          <div className="w-full flex relative items-center py-2">
            <input
              className="bg-black rounded text-[0.8rem] w-full h-[2rem] px-2 border-2 transition-all border-secondary hover:border-active outline-active"
              type="email"
              placeholder="Enter your email"
            />
            <button type="submit" className="absolute right-2">
              <AiOutlineSend className="pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="flex flex-col gap-2 w-[15rem]">
          <h2 className="text-[1.3rem] mb-3">Support</h2>
          <p className="text-sm mb-1">111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh.</p>
          <p className="text-sm mb-1">exclusive@gmail.com</p>
          <p className="text-sm mb-1">+88015-88888-9999</p>
        </div>

        {/* Account Links */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[1.3rem] mb-3">Account</h2>
          <Link className="text-sm mb-1 hover:underline hover:text-action transition-all" href="/my-account">
            My Account
          </Link>
          <Link className="text-sm mb-1 hover:underline hover:text-action transition-all" href="/login">
            Login / Register
          </Link>
          <Link className="text-sm mb-1 hover:underline hover:text-action transition-all" href="/cart">
            Cart
          </Link>
          <Link className="text-sm mb-1 hover:underline hover:text-action transition-all" href="/wishlist">
            Wishlist
          </Link>
          <Link className="text-sm mb-1 hover:underline hover:text-action transition-all" href="/shop">
            Shop
          </Link>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[1.3rem] mb-3">Quick Link</h2>
          <Link className="text-sm mb-1 hover:underline hover:text-action transition-all" href="/privacy&policy">
            Privacy Policy
          </Link>
          <Link className="text-sm mb-1 hover:underline hover:text-action transition-all" href="/terms-of-use">
            Terms Of Use
          </Link>
          <Link className="text-sm mb-1 hover:underline hover:text-action transition-all" href="/faq">
            FAQ
          </Link>
          <Link className="text-sm mb-1 hover:underline hover:text-action transition-all" href="/contact">
            Contact
          </Link>
        </div>

        {/* Download App */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[1.3rem] mb-3">Download App</h2>
          <p className="text-sm mb-1">Save $3 with App New User Only</p>
          <div className="flex w-full items-center gap-2">
            <span className="w-1/2 h-full">
              <HiOutlineQrcode className="w-full h-full" />
            </span>
            <div className="flex flex-col gap-2 w-1/2 h-[5rem] justify-between">
              <Link className="h-max w-full hover:border-2 rounded-md hover:border-action" href="#">
                <Image src="/icons/GooglePlay.svg" alt="Google Play Store" className="w-full h-full" width={150} height={50}/>
              </Link>
              <Link className="h-max w-full hover:border-2 rounded-md hover:border-action" href="#">
                <Image className="w-full h-full" src="/icons/app-store.svg" alt="Apple App Store" width={150} height={50}/>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="py-4 px-[7%] border-t-[0.8px] leading-10 border-secondary w-full text-center">
        &copy; {new Date().getFullYear()} - AltSchool-V3 Circle 70. All rights reserved.
      </p>
    </footer>
  );
}
