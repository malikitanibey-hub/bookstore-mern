import React from "react";
import {
  BookOpen,
  DollarSign,
  Truck,
  ShieldCheck,
  Headphones,
  Gift,
  Users,
  LayoutGrid,
} from "lucide-react";

function About() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section
        className="relative mt-[150px] h-[420px] bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: "url('/aboutus-hero.jpg')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {" "}
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About BookStore
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-5">
              Your trusted online bookstore
            </p>

            <div className="w-24 h-1 bg-[#F86D72]"></div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            {/* Text */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
                Our Story
              </h2>

              <div className="w-28 h-1 bg-[#F86D72] mb-6"></div>

              <p className="text-gray-600 leading-7 mb-4">
                BookStore was founded with a simple mission: to make books
                accessible to everyone. Whether you love fiction, non-fiction,
                children's books, or anything in between, we want to help you
                discover your next favorite book.
              </p>

              <p className="text-gray-600 leading-7">
                We believe in the power of books to inspire, educate, and
                entertain. Thank you for being part of our journey.
              </p>
            </div>

            {/* Image */}
            <div>
              <img
                src="/aboutus-image.jpg"
                alt="Books in our bookstore"
                className="w-full h-[300px] md:h-[350px] object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-6xl mx-auto border border-gray-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
            {/* Books */}
            <div className="p-7 text-center">
              <div className="flex justify-center mb-3">
                <BookOpen className="w-8 h-8 text-[#F86D72]" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">500+</h2>

              <p className="text-sm text-gray-500 mt-1">Books Available</p>
            </div>

            {/* Customers */}
            <div className="p-7 text-center">
              <div className="flex justify-center mb-3">
                <Users className="w-8 h-8 text-[#F86D72]" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">1000+</h2>

              <p className="text-sm text-gray-500 mt-1">Happy Customers</p>
            </div>

            {/* Categories */}
            <div className="p-7 text-center">
              <div className="flex justify-center mb-3">
                <LayoutGrid className="w-8 h-8 text-[#F86D72]" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">50+</h2>

              <p className="text-sm text-gray-500 mt-1">Categories</p>
            </div>

            {/* Support */}
            <div className="p-7 text-center">
              <div className="flex justify-center mb-3">
                <Headphones className="w-8 h-8 text-[#F86D72]" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">24/7</h2>

              <p className="text-sm text-gray-500 mt-1">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Why Choose Us
            </h2>

            <div className="w-24 h-1 bg-[#F86D72] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Wide Selection */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition h-full min-h-[210px] flex flex-col items-center">
              {" "}
              <div className="flex justify-center mb-4">
                <BookOpen className="w-8 h-8 text-[#F86D72]" />
              </div>
              <h2 className="font-semibold text-gray-900 mb-2">
                Wide Selection
              </h2>
              <p className="text-sm text-gray-500 leading-6">
                Thousands of titles across all genres and categories.
              </p>
            </div>

            {/* Affordable Prices */}
            <div className="bg-white border border-gray-200 rounded-lg p-7 text-center hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <DollarSign className="w-8 h-8 text-[#F86D72]" />
              </div>

              <h2 className="font-semibold text-gray-900 mb-2">
                Affordable Prices
              </h2>

              <p className="text-sm text-gray-500 leading-6">
                Great books at competitive and affordable prices.
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-white border border-gray-200 rounded-lg p-7 text-center hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <Truck className="w-8 h-8 text-[#F86D72]" />
              </div>

              <h2 className="font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h2>

              <p className="text-sm text-gray-500 leading-6">
                Quick and reliable delivery directly to your door.
              </p>
            </div>

            {/* Secure Shopping */}
            <div className="bg-white border border-gray-200 rounded-lg p-7 text-center hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-[#F86D72]" />
              </div>

              <h2 className="font-semibold text-gray-900 mb-2">
                Secure Shopping
              </h2>

              <p className="text-sm text-gray-500 leading-6">
                Your data and payments are safe with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Our Team
            </h2>

            <div className="w-20 h-1 bg-[#F86D72] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Team Member 1 */}
            <div className="text-center">
              <img
                src="/John-Doe.jpg"
                alt="John Doe"
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />

              <h2 className="font-semibold text-gray-900 text-2xl">John Doe</h2>

              <p className="text-sm text-gray-500 mt-1">Founder & CEO</p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <img
                src="/Jane-Smith.jpg"
                alt="Jane Smith"
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />

              <h2 className="font-semibold text-gray-900 text-2xl">
                Jane Smith
              </h2>

              <p className="text-sm text-gray-500 mt-1">Head of Operations</p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <img
                src="/Michael-Lee.jpg"
                alt="Michael Lee"
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />

              <h2 className="font-semibold text-gray-900 text-2xl">
                Michael Lee
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Customer Support Lead
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Community */}
      <section
        className="relative py-16 md:py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/aboutus-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <div className="flex justify-center mb-4">
            <Gift className="w-9 h-9 text-[#F86D72]" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Join Our Community
          </h2>

          <p className="text-gray-200 mb-7">
            Subscribe to get updates on new books, special offers, and more.
          </p>

          <div className="max-w-xl mx-auto flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-md sm:rounded-r-none text-gray-800 outline-none"
            />

            <button className="mt-3 sm:mt-0 px-3 py-3 bg-[#F86D72] hover:bg-[#f45b61] text-white font-medium rounded-md sm:rounded-l-none transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
