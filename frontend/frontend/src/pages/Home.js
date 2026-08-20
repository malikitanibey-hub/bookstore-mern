import React from "react";
import Hero from "../components/Hero";
import Highlights from "../components/Highlights";
import FeaturedProducts from "../components/FeaturedProducts";
import OnSaleProducts from "../components/OnSaleProducts";

function Home() {
  return (
    <div>
      <Hero />

      <div className="p-8">
        <Highlights />
        <FeaturedProducts />
        <OnSaleProducts />
      </div>
    </div>
  );
}

export default Home;
