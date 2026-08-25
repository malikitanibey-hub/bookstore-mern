import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
  },
};

function Hero() {
  return (
    <section className="w-full pt-28 sm:pt-32 md:pt-36">
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={4000}
        keyBoardControl={true}
        customTransition="transform 500ms ease-in-out"
        transitionDuration={700}
        containerClass="w-full"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="w-full"
      >
        {/* Slide 1 */}
        <div className="relative w-full h-[60vh] min-h-[420px] max-h-[750px]">
          <img
            src="/1.jpg"
            alt="Discover your next favorite book"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              <div className="max-w-xl text-white">
                <p className="text-sm sm:text-base uppercase tracking-[0.2em] mb-3">
                  Welcome to our bookstore
                </p>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Find Your Next
                  <span className="block">Great Read</span>
                </h1>

                <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90 max-w-lg">
                  Explore our collection of books and discover stories,
                  knowledge, and adventures waiting for you.
                </p>

                <button
                  onClick={() => {
                    window.location.href = "/products";
                  }}
                  className="mt-7 bg-[#F86D72] hover:bg-[#e85d63] text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                >
                  Explore Books
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="relative w-full h-[60vh] min-h-[420px] max-h-[750px]">
          <img
            src="/2.jpg"
            alt="Explore our book collection"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              <div className="max-w-xl text-white">
                <p className="text-sm sm:text-base uppercase tracking-[0.2em] mb-3">
                  Explore our collection
                </p>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Stories That
                  <span className="block">Stay With You</span>
                </h2>

                <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90 max-w-lg">
                  From timeless classics to modern favorites, find something
                  you'll love.
                </p>

                <button
                  onClick={() => {
                    window.location.href = "/products";
                  }}
                  className="mt-7 bg-[#F86D72] hover:bg-[#e85d63] text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                >
                  Shop Books
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="relative w-full h-[60vh] min-h-[420px] max-h-[750px]">
          <img
            src="/11.jpg"
            alt="Featured books"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              <div className="max-w-xl text-white">
                <p className="text-sm sm:text-base uppercase tracking-[0.2em] mb-3">
                  Featured books
                </p>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Something New
                  <span className="block">Is Waiting</span>
                </h2>

                <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90 max-w-lg">
                  Check out our featured selection and discover your next
                  favorite book.
                </p>

                <button
                  onClick={() => {
                    window.location.href = "/products";
                  }}
                  className="mt-7 bg-[#F86D72] hover:bg-[#e85d63] text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                >
                  View Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </Carousel>
    </section>
  );
}

export default Hero;