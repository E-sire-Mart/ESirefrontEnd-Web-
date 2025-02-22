// src/app/layout.tsx

import { CartProvider } from "../context/cart-context";
import { WishlistProvider } from "../context/wishlist-context";
import { AuthContextProvider } from "../context/auth-context";
import "../styles/globals.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-commerce Platform",
  description: "Your go-to store for all things awesome.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </WishlistProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
