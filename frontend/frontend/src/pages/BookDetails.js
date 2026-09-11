import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../auth/CartContext";
import { getBookImage, onImageError } from "../utils/imageHelper";
import { useAuth } from "../auth/AuthContext";
import LoginRequiredPopup from "../components/LoginRequiredPopup";
import AdminActionPopup from "../components/AdminActionPopup";
import { Heart } from "lucide-react";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [message, setMessage] = useState("");

  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className=" flex justify-center items-center mt-44">
        <div className="w-10 h-10 border-4 border-[#F86D72] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const isFavorite = favorites.some((favorite) => favorite._id === book?._id);

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    if (user?.role === "admin") {
      setShowAdminPopup(true);
      return;
    }

    setFavorites((prev) => {
      const exists = prev.some((favorite) => favorite._id === book._id);

      const updatedFavorites = exists
        ? prev.filter((favorite) => favorite._id !== book._id)
        : [...prev, book];

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      return updatedFavorites;
    });
  };

  return (
    <div className="mt-56 max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-center">
          <img
            className="w-80 h-[450px] object-cover rounded-lg"
            src={getBookImage(book.coverImage)}
            alt={book.title}
            onError={onImageError}
          />
        </div>

        <div>
          <h3 className="mb-5">{book?.title}</h3>
          <p className="text-lg text-gray-600 mb-2">{book.author}</p>
          <p className="text-gray-500 mb-4 leading-relaxed">
            {book.description}
          </p>
          <p className="text-2xl font-bold text-[#F86D72] mb-2">
            {book.price} $
          </p>
          <p
            className={`${book?.stock > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {book?.stock > 0 ? `${book?.stock} Available` : "Out of Stock"}
          </p>
          <div className="mt-3">
            <span className="text-gray-500 ">{book?.category?.name}</span>
          </div>

          <div className="mt-7 flex gap-3">
            {/* Favorite Button */}
            <button
              type="button"
              onClick={toggleFavorite}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white transition hover:bg-[#fff1f1]"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                size={22}
                className={
                  isFavorite ? "fill-[#F86D72] text-[#F86D72]" : "text-gray-400"
                }
              />
            </button>

            {/* Add To Cart */}
            <button
              onClick={async () => {
                if (!isAuthenticated) {
                  setShowLoginPopup(true);
                  return;
                }

                if (user?.role === "admin") {
                  setShowAdminPopup(true);
                  return;
                }

                const success = await addToCart(book._id);

                if (!success) {
                  return;
                }

                setMessage("Added To Cart Successfully");

                setTimeout(() => {
                  setMessage("");
                }, 2500);
              }}
              disabled={book.stock === 0}
              className="h-11 flex-1 rounded-lg bg-[#F86D72] px-4 font-medium text-white transition hover:bg-[#e95d63] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {book.stock === 0 ? "Out of stock" : "Add to Cart"}
            </button>
          </div>
          {message && (
            <div className="mb-4 p-3 mt-5 rounded bg-green-100 text-green-700 text-center">
              {message}
            </div>
          )}
        </div>
      </div>
      {showLoginPopup && (
        <LoginRequiredPopup onClose={() => setShowLoginPopup(false)} />
      )}
      {showAdminPopup && (
        <AdminActionPopup onClose={() => setShowAdminPopup(false)} />
      )}
    </div>
  );
}

export default BookDetails;
