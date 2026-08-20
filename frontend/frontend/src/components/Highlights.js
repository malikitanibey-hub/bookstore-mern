import React from "react";
import { BadgeCheck, ShieldCheck, ShoppingCart, Tag } from "lucide-react";

function Highlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 px-8">
      <div className="flex items-center gap-3 max-w-md w-full mx-auto">
        <ShoppingCart className="text-[#F86D72] w-8 h-8 shrink-0" />
        <div>
          <h4 className="font-semibold">Free Delivery</h4>
          <p className="text-sm text-gray-600">
            Enjoy fast and free shipping on all your orders with no extra cost.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 max-w-md w-full mx-auto">
        <BadgeCheck className="text-[#F86D72] w-8 h-8 shrink-0" />
        <div>
          <h4 className="font-semibold">Quality Guarantee</h4>
          <p className="text-sm text-gray-600">
            We ensure premium quality for every book and product we offer.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 max-w-md w-full mx-auto">
        <Tag className="text-[#F86D72] w-8 h-8 shrink-0" />
        <div>
          <h4 className="font-semibold">Daily Offers</h4>
          <p className="text-sm text-gray-600">
            Discover new deals and discounts every day on top titles.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 max-w-md w-full mx-auto">
        <ShieldCheck className="text-[#F86D72] w-8 h-8 shrink-0" />
        <div>
          <h4 className="font-semibold">100% Secure Payment</h4>
          <p className="text-sm text-gray-600">
            Your payments are fully protected with safe and reliable checkout.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Highlights;
