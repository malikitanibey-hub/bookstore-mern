import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Heart } from "lucide-react";
import { useCart } from "../auth/CartContext";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  const { addToCart } = useCart();

  // Load favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Remove from favorites
  const removeFavorite = (bookId) => {
    const updatedFavorites = favorites.filter(
      (book) => book._id !== bookId
    );

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Add to cart
  const handleAddToCart = (bookId) => {
    addToCart(bookId);

    setMessage("Added To Cart Successfully");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-48">
      {/* Hero */}
      <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-black">
        <img
          src="/favorites-hero.jpg"
          alt="Favorites"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />

        <div className="relative z-10 px-4 text-center text-white">
          <h1 className="text-3xl font-bold md:text-5xl">
            My Favorites
          </h1>

          <p className="mt-3 text-sm md:text-base">
            Your favorite books, all in one place
          </p>
        </div>
      </section>

      {/* Favorites */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Favorite Books
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {favorites.length}{" "}
            {favorites.length === 1 ? "book" : "books"} in your favorites
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-5 rounded bg-green-100 p-3 text-center text-green-700">
            {message}
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-12 text-center">
            <Heart
              className="mx-auto mb-4 text-gray-300"
              size={50}
            />

            <h2 className="font-semibold text-gray-700 text-2xl">
              No favorite books yet
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Browse our books and add your favorites to see them here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-lg bg-[#F86D72] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#e95d63]"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((book) => (
              <div
                key={book._id}
                className="relative flex h-full min-h-[500px] flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Remove Favorite */}
                <button
                  type="button"
                  onClick={() => removeFavorite(book._id)}
                  className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
                  aria-label="Remove from favorites"
                >
                  <Heart
                    size={20}
                    className="fill-[#F86D72] text-[#F86D72]"
                  />
                </button>

                {/* Book */}
                <Link to={`/bookDetails/${book._id}`}>
                  <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/images/${book.coverImage}`}
                      alt={book.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="mt-4 flex flex-1 flex-col">
                    <h6 className="line-clamp-2 h-12 text-lg font-semibold text-gray-800">
                      {book.title}
                    </h6>

                    <span className="mt-2 h-6 truncate text-sm text-gray-500">
                      {book.author}
                    </span>

                    <strong className="mt-3 text-lg font-semibold text-[#F86D72]">
                      {book.price} $
                    </strong>
                  </div>
                </Link>

                {/* Cart */}
                <div className="mt-auto pt-5">
                  <div className="h-6 text-sm text-gray-500">
                    Stock: {book.stock}
                  </div>

                  <button
                    onClick={() => handleAddToCart(book._id)}
                    disabled={book.stock === 0}
                    className="mt-4 h-11 w-full rounded-lg bg-[#F86D72] px-4 font-medium text-white transition hover:bg-[#e95d63] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {book.stock === 0
                      ? "Out of stock"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Favorites;