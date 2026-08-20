import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

function Allbooks() {
  const [bookList, setBookList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/getBooks", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401 || res.status === 403) {
          setError("Not Authorized");
          navigate("/", { replace: true });
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setBookList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError(error.message);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchBooks();
    } else {
      console.log("Not Authenticated or not admin");
      navigate("/", { replace: true });
    }
  }, [navigate, isAuthenticated, isAdmin]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          All Books
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view all books in your bookstore.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {bookList?.map((book) => (
          <a href={`/admin/update-book/${book?._id}`}>
          <div
            key={book._id}
            className="flex h-full min-h-[470px] flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Book Image */}
            <div className="flex h-60 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
              <img
                src={`http://localhost:5000/images/${book.coverImage}`}
                alt={book.title}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Book Information */}
            <div className="mt-4 flex flex-1 flex-col">
              <h6 className="h-12 text-lg font-semibold leading-6 text-gray-800 line-clamp-2">
                {book?.title}
              </h6>

              <span className="mt-2 h-6 truncate text-sm text-gray-500">
                {book?.author}
              </span>

              <strong className="mt-3 text-lg font-semibold text-[#F86D72]">
                {book?.price} $
              </strong>

              {/* Bottom Information */}
              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Stock</span>
                  <span
                    className={`font-medium ${
                      book?.stock === 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {book?.stock}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="max-w-[120px] truncate text-gray-700">
                    {book?.category?.name || "No Category"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Allbooks;