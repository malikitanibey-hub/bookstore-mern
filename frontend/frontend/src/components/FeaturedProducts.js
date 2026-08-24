import React, { useEffect, useState } from "react";
import { useCart } from "../auth/CartContext";
import { Link } from "react-router-dom";

function FeaturedProducts() {
  const [bookList, setBookList] = useState([]);
  const [message, setMessage] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/books/getBooks`)
      .then((res) => res.json())
      .then((data) => setBookList(data))
      .catch((err) => console.log("Error fetching books: ", err));
  }, []);

  // const handleAdd = async(bookId) => {
  //   await addToCart(bookId)
  //   fetch(`${process.env.REACT_APP_API_URL}/books/getBooks`)
  //     .then((res) => res.json())
  //     .then((data) => setBookList(data))
  // }

  const featuredBooks = bookList?.filter((book) => book?.isFeatured === true);

  return (
    <div className="mt-10 px-4 md:px-8 lg:px-12">
      <h3 className="my-6 text-2xl font-semibold text-gray-800">
        Featured Products
      </h3>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-center">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredBooks?.map((book) => (
          <div
            key={book._id}
            className="flex flex-col h-full min-h-[500px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Clickable Book Section */}
            <Link to={`/bookDetails/${book?._id}`}>
              {/* Image */}
              <div  className="w-full h-64 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                <img
                  src={`/images/${book.coverImage}`}
                  alt={book.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Book Information */}
              <div className="flex flex-col flex-1 mt-4">
                <h6 className="h-12 text-lg font-semibold text-gray-800 line-clamp-2">
                  {book?.title}
                </h6>

                <span className="mt-2 h-6 text-sm text-gray-500 truncate">
                  {book?.author}
                </span>

                <strong className="mt-3 text-lg font-semibold text-[#F86D72]">
                  {book?.price} $
                </strong>
              </div>
            </Link>

            {/* Bottom Section */}
            <div className="mt-auto pt-5">
              <div className="h-6 text-sm text-gray-500">
                Stock: {book?.stock}
              </div>

              <button
                onClick={() => {
                  addToCart(book._id);

                  setBookList((prev) =>
                    prev.map((b) =>
                      b._id === book._id ? { ...b, stock: b.stock - 1 } : b,
                    ),
                  );

                  setMessage("Added To Cart Successfully");
                }}
                disabled={book.stock === 0}
                className="mt-4 h-11 w-full rounded-lg bg-[#F86D72] px-4 font-medium text-white transition hover:bg-[#e95d63] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {book.stock === 0 ? "Out of stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;
