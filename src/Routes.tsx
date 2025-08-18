import React, { Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProductViewAll from "./components/Products/ProductViewall";
import ProductViewAllByCategory from "./components/Products/ProductViewAllByCategory";
import { Loader } from "./components/shared";
import { Error404, Home, Profile, RegisterStore } from "./pages";
import ResetPassword from "./components/auth/ResetPass";
import EmailVerification from "./pages/EmailVerification";

const ProductView = React.lazy(() => import("./pages/ProductView"));

const AppWithRouting = () => {
  const [searchText, setSearchText] = useState<string>('');

  const onSearch = (text: string) => {
    setSearchText(text);
  }

  return (
    <Routes>
      <Route path="/" element={<Layout component={<Home searchText={searchText}/>} onSearch={onSearch} />} />
      <Route path="/profile" element={<Layout component={<Profile />} onSearch={onSearch} />} />
      <Route path="/register-store" element={<Layout component={<RegisterStore />} onSearch={onSearch} />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route
        path="/products/shop/:shopId"
        element={<Layout component={<ProductViewAll searchText={searchText}/>} onSearch={onSearch}/>}
      />
      <Route
        path="/products/category/:category"
        element={
          <Layout component={<ProductViewAllByCategory searchText={searchText}/>} onSearch={onSearch}/>
        }
      />
      <Route
        path="/prn/:name/prid/:id"
        element={
          <Suspense fallback={<Loader />}>
            <Layout component={<ProductView />} onSearch={onSearch}/>
          </Suspense>
        }
      />
      <Route
        path="/not-found"
        element={<Layout noFooter={true} component={<Error404 />} onSearch={onSearch}/>}
      />
      <Route
        path="*"
        element={<Layout noFooter={true} component={<Error404 />} onSearch={onSearch}/>}
      />
    </Routes>
  );
};

export default AppWithRouting;
