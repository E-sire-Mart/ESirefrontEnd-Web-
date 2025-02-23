"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { HiOutlineSearch, HiOutlineHeart, HiOutlineMenu } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import { CiUser } from "react-icons/ci";
import { useCart } from "../context/cart-context";
import { useWishlist } from "../context/wishlist-context";
import { useAuth } from "../context/auth-context";
import allProductsStore from "../app/data/allProductsStore.json";
import { Product } from "../types/product";

export default function Navbar() {
  const { user } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  // const router = useRouter();

  const inputValueRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setIsLargeScreen(window.innerWidth >= 1024);

    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isLargeScreen) setDropDown(false);
  }, [isLargeScreen]);

  useEffect(() => {
    if (searchQuery) {
      const filteredProducts = allProductsStore.allProductsStore.filter((product) =>
        (product as unknown as Product).name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchedProducts(filteredProducts as unknown as Product[]);
    } else {
      setSearchedProducts([]);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (inputValueRef.current) {
      setSearchQuery(inputValueRef.current.value);
    }
  };

  return (
    <header className="flex justify-between w-full h-[6rem] px-[7%] items-center border-b-2 border-secondary relative">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex w-full justify-between">
        <Link className="text-[2rem] font-bold" href="/">Exclusive</Link>
        <button type="button" onClick={() => setDropDown(!dropDown)}>
          {dropDown ? <CgClose className="w-10 h-10" /> : <HiOutlineMenu className="w-10 h-10" />}
        </button>
      </div>

      {/* Desktop & Mobile Navigation */}
      <div className="flex w-full justify-between items-center">
        <Link className="hidden lg:block text-[2rem] font-bold" href="/">Exclusive</Link>

        <nav className={`flex gap-6 ${isLargeScreen ? "" : dropDown ? "absolute bg-secondary p-6 z-20 top-[6rem] right-0" : "hidden"}`}>
          <Link className="px-2 py-1 hover:underline" href="/">Home</Link>
          <Link className="px-2 py-1 hover:underline" href="/contact">Contact</Link>
          <Link className="px-2 py-1 hover:underline" href="/about">About</Link>
          {!user && <Link className="px-2 py-1 hover:underline" href="/login">Login</Link>}
        </nav>

        {/* Search Bar */}
        <div className="relative">
          <input
            ref={inputValueRef}
            onChange={handleSearch}
            className="rounded bg-secondary pl-2 pr-10 py-1 text-[0.8rem] w-[13rem] border-2 transition-all border-secondary hover:border-active outline-active"
            placeholder="What are you looking for?"
          />
          <HiOutlineSearch className="absolute right-2 top-2" />
          {searchQuery && (
            <ul className="absolute top-full right-0 bg-secondary w-[20rem] max-h-[32rem] overflow-y-scroll z-20 p-4 rounded-b-md">
              {searchedProducts.map((product) => (
                <li key={product._id}>
                  <Link className="flex gap-4 items-center hover:text-action hover:underline" href={`/product/${product._id}`}>
                    <Image src={product.image} alt={product.alt}  className="w-6 h-6"/>
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Icons: Wishlist, Cart, User Profile */}
        <div className="flex gap-6 items-center">
          <Link className="relative hover:bg-action hover:text-white p-2 rounded" href="/wishlist">
            <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{wishlist.length}</span>
            <HiOutlineHeart className="h-6 w-6" />
          </Link>

          <Link className="relative hover:bg-action hover:text-white p-2 rounded" href="/cart">
            <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{cart.length}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </Link>

          {user ? (
            <Link className="rounded-full hover:bg-action transition-all" href="/my-account">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt="User" className="w-8 h-8 rounded-full" />
              ) : (
                <CiUser className="w-8 h-8 p-1 bg-red-500 rounded-full text-white" />
              )}
            </Link>
          ) : (
            <Link className="rounded-full hover:bg-action transition-all" href="/login">
              <CiUser className="w-8 h-8 p-1 bg-red-500 rounded-full text-white" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden" type="button" onClick={() => setDropDown(!dropDown)}>
          {dropDown ? <CgClose className="w-10 h-10" /> : <HiOutlineMenu className="w-10 h-10" />}
        </button>
      </div>
    </header>
  );
}