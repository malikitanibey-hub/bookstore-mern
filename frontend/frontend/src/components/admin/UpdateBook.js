import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getBookImage, onImageError } from "../../utils/imageHelper";

function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingBook, setLoadingBook] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    discountPercent: "",
    isFeatured: false,
    isOnSale: false,
    coverImage: null,
  });

  const [currentImage, setCurrentImage] = useState("");
  const [preview, setPreview] = useState(null);

  // Check admin and load book/categories
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !isAdmin) {
      navigate("/", { replace: true });
      return;
    }

    const loadData = async () => {
      try {
        // Get book
        const bookRes = await fetch(
          `${process.env.REACT_APP_API_URL}/books/${id}`
        );

        const bookData = await bookRes.json();

        if (!bookRes.ok) {
          throw new Error(bookData?.message || "Failed to load book");
        }

        setForm({
          title: bookData.title || "",
          author: bookData.author || "",
          description: bookData.description || "",
          price: bookData.price ?? "",
          stock: bookData.stock ?? "",
          category: bookData.category?._id || bookData.category || "",
          discountPercent: bookData.discountPercent || "",
          isFeatured: Boolean(bookData.isFeatured),
          isOnSale: Boolean(bookData.isOnSale),
          coverImage: null,
        });

        setCurrentImage(bookData.coverImage || "");

        // Get categories
        const categoryRes = await fetch(
          `${process.env.REACT_APP_API_URL}/category/getCategories`,
          {
            credentials: "include",
          }
        );

        const categoryData = await categoryRes.json();

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData?.categories || []
        );
      } catch (error) {
        console.error("Failed to load update data:", error);
        setMessage("❌ Failed to load book.");
      } finally {
        setLoadingBook(false);
        setLoadingCats(false);
      }
    };

    loadData();
  }, [id, authLoading, isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;

      setForm((prev) => ({
        ...prev,
        coverImage: file,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }

      return;
    }

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!isAuthenticated || !isAdmin) {
      navigate("/", { replace: true });
      return;
    }

    if (
      !form.title ||
      !form.author ||
      !form.description ||
      form.price === "" ||
      form.stock === ""
    ) {
      setMessage(
        "❌ Title, author, description, price and stock are required."
      );
      return;
    }

    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("author", form.author);
    fd.append("description", form.description);
    fd.append("price", String(form.price));
    fd.append("stock", String(form.stock));
    fd.append("category", form.category || "");
    fd.append("discountPercent", String(form.discountPercent || ""));
    fd.append("isFeatured", String(form.isFeatured));
    fd.append("isOnSale", String(form.isOnSale));

    // Only send an image if the admin selected a new one
    if (form.coverImage) {
      fd.append("coverImage", form.coverImage);
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/books/updateBook/${id}`,
        {
          method: "PUT",
          credentials: "include",
          body: fd,
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403) {
        setMessage("❌ Not authorized.");
        navigate("/", { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Update failed");
      }

      setMessage("Book Updated Successfully");

      // Update displayed image if a new one was uploaded
      if (data?.book?.coverImage) {
        setCurrentImage(data.book.coverImage);
      }

      setForm((prev) => ({
        ...prev,
        coverImage: null,
      }));

      setPreview(null);

      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error) {
      console.error("Error updating book:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/books/deleteBook/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Delete failed");
      }

      setShowDeletePopup(false);
      setMessage("Book Deleted Successfully");

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error("Error deleting book:", error);
      setMessage(`❌ ${error.message}`);
      setSubmitting(false);
    }
  };

  if (authLoading || loadingBook) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#F86D72] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-slate-800">
          Update Book
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Update the book information below.
        </p>
      </div>

      {message && (
        <div
          className={`mb-5 p-3 rounded-lg text-sm ${
            message.startsWith("❌")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleUpdate}
        className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title *
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Book title"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Author *
            </label>

            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Author name"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price *
            </label>

            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. 19.99"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Stock *
            </label>

            <input
              type="number"
              name="stock"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. 20"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description *
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-300 resize-y"
              placeholder="Write a short description..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={loadingCats}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-300 bg-white"
            >
              <option value="">
                {loadingCats ? "Loading..." : "Select category"}
              </option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Discount Percent
            </label>

            <input
              type="number"
              name="discountPercent"
              min="0"
              max="100"
              step="1"
              value={form.discountPercent}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. 10"
            />
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm text-slate-700">
                  Featured
                </span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={form.isOnSale}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm text-slate-700">
                  On Sale
                </span>
              </label>
            </div>
          </div>

          {/* Cover Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cover Image
            </label>

            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />

            <p className="text-xs text-slate-500 mt-2">
              Leave this empty if you want to keep the current image.
            </p>

            {/* Images */}
            <div className="mt-4 flex flex-col sm:flex-row gap-5">
              {/* Current image */}
              {currentImage && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">
                    Current image:
                  </p>

                  <img
                    src={getBookImage(currentImage)}
                    alt="Current book cover"
                    onError={onImageError}
                    className="w-32 h-44 sm:w-40 sm:h-52 object-contain rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              )}

              {/* New image preview */}
              {preview && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">
                    New image:
                  </p>

                  <img
                    src={preview}
                    alt="New book cover preview"
                    className="w-32 h-44 sm:w-40 sm:h-52 object-contain rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowDeletePopup(true)}
            disabled={submitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60"
          >
            Delete
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "Updating..." : "Update Book"}
          </button>
        </div>
      </form>

      {/* Delete confirmation */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-3 text-slate-800">
              Delete Book
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this book?
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeletePopup(false)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-60"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateBook;