import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Baby,
  BriefcaseBusiness,
  BookOpenText,
  Heart,
  Search,
  Trophy,
} from "lucide-react";
import { useCart } from "../auth/CartContext";

function Products() {
  const [bookList, setBookList] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);

  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart } = useCart();

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const booksPerPage = 8;

  // Fetch books
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/books/getBooks`)
      .then((res) => res.json())
      .then((data) => {
        setBookList(data);

        if (data.length > 0) {
          const highestPrice = Math.max(
            ...data.map((book) => Number(book.price) || 0),
          );

          setMaxPrice(Math.ceil(highestPrice));
        }
      })
      .catch((err) => console.log("Error fetching books:", err));
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/category/getCategories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log("Error fetching categories:", err));
  }, []);

  // Category icon
  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase();

    if (name === "programming") return <Trophy />;
    if (name === "fiction") return <BookOpen />;
    if (name === "kids") return <Baby />;
    if (name === "business") return <GraduationCap />;
    if (name === "history") return <BookOpenText />;
    if (name === "self help") return <Heart />;

    return <BookOpen />;
  };

  // Filter + sort
  const filteredBooks = useMemo(() => {
    let result = [...bookList];

    // Search
    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchValue) ||
          book.author?.toLowerCase().includes(searchValue) ||
          book.category?.name?.toLowerCase().includes(searchValue),
      );
    }

    // Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (book) =>
          book.category?.name?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Availability
    if (availability === "inStock") {
      result = result.filter((book) => book.stock > 0);
    }

    if (availability === "outOfStock") {
      result = result.filter((book) => book.stock === 0);
    }

    // Price
    result = result.filter(
      (book) =>
        Number(book.price) >= Number(minPrice) &&
        Number(book.price) <= Number(maxPrice),
    );

    // Sorting
    if (sortBy === "priceLow") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "priceHigh") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [
    bookList,
    search,
    selectedCategory,
    availability,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const startIndex = (currentPage - 1) * booksPerPage;

  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage,
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleAddToCart = (bookId) => {
    addToCart(bookId);

    setBookList((prev) =>
      prev.map((book) =>
        book._id === bookId
          ? { ...book, stock: Math.max(0, book.stock - 1) }
          : book,
      ),
    );

    setMessage("Added To Cart Successfully");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const toggleFavorite = (book) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item._id === book._id);

      const updatedFavorites = exists
        ? prev.filter((item) => item._id !== book._id)
        : [...prev, book];

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      return updatedFavorites;
    });
  };

  const isFavorite = (bookId) => {
    return favorites.some((book) => book._id === bookId);
  };

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-48">
      {/* Hero */}
      <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-black">
        <img
          src="/products-hero.jpg"
          alt="Books"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />

        <div className="relative z-10 px-4 text-center text-white">
          <h1 className="text-3xl font-bold md:text-5xl">All Our Books</h1>

          <p className="mt-3 text-sm md:text-base">
            Discover your next favorite book from our collection
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-6 flex w-full max-w-xl overflow-hidden rounded-md bg-white"
          >
            <input
              type="text"
              placeholder="Search book, author or category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-700 outline-none"
            />

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#F86D72] px-5 text-sm font-medium text-white transition hover:bg-[#e95d63] rounded-none justify-center"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">
          Browse by Categories
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <button
            onClick={() => handleCategory("All")}
            className={`rounded-lg border p-5 text-center transition hover:-translate-y-1 hover:shadow-md ${
              selectedCategory === "All"
                ? "border-[#F86D72] bg-[#fff5f5]"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-[#F86D72]">
              <BookOpen size={25} />
            </div>

            <h2 className="text-sm font-semibold text-gray-800">All Books</h2>

            <p className="mt-1 text-xs text-gray-500">
              {bookList.length} Books
            </p>
          </button>

          {categories.map((category) => {
            const count = bookList.filter(
              (book) => book.category?._id === category._id,
            ).length;

            return (
              <button
                key={category._id}
                onClick={() => handleCategory(category.name)}
                className={`min-w-0 overflow-hidden rounded-lg border p-5 text-center transition hover:-translate-y-1 hover:shadow-md ${
                  selectedCategory.toLowerCase() === category.name.toLowerCase()
                    ? "border-[#F86D72] bg-[#fff5f5]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f1] text-[#F86D72]">
                  {React.cloneElement(getCategoryIcon(category.name), {
                    size: 25,
                  })}
                </div>

                <h2 className="break-words text-sm font-semibold text-gray-800">
                  {category.name}
                </h2>

                <p className="mt-1 text-xs text-gray-500">{count} Books</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Products */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">All Books</h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredBooks.length === 0 ? 0 : startIndex + 1} -{" "}
              {Math.min(startIndex + booksPerPage, filteredBooks.length)} of{" "}
              {filteredBooks.length} books
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Sort by:</label>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#F86D72]"
            >
              <option value="newest">Newest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Filters */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="  font-semibold text-gray-800">Filters</h2>

              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setAvailability("all");
                  setMinPrice(0);
                  setMaxPrice(
                    bookList.length > 0
                      ? Math.ceil(
                          Math.max(
                            ...bookList.map((book) => Number(book.price) || 0),
                          ),
                        )
                      : 100,
                  );
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="text-xs text-white "
              >
                Clear Filters
              </button>
            </div>

            {/* Price */}
            <div className="border-b border-gray-100 pb-5">
              <h4 className="mb-3 text-sm font-medium text-gray-700">
                Price Range
              </h4>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded border border-gray-200 px-2 py-2 text-xs outline-none focus:border-[#F86D72]"
                />

                <span className="text-gray-400">-</span>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded border border-gray-200 px-2 py-2 text-xs outline-none focus:border-[#F86D72]"
                />
              </div>
            </div>

            {/* Category */}
            <div className="border-b border-gray-100 py-5">
              <h4 className="mb-3 text-sm font-medium text-gray-700">
                Category
              </h4>

              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === "All"}
                    onChange={() => handleCategory("All")}
                    className="accent-[#F86D72]"
                  />
                  All Categories
                </label>

                {categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={
                        selectedCategory.toLowerCase() ===
                        category.name.toLowerCase()
                      }
                      onChange={() => handleCategory(category.name)}
                      className="accent-[#F86D72]"
                    />

                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-5">
              <h4 className="mb-3 text-sm font-medium text-gray-700">
                Availability
              </h4>

              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === "all"}
                    onChange={() => setAvailability("all")}
                    className="accent-[#F86D72]"
                  />
                  All
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === "inStock"}
                    onChange={() => setAvailability("inStock")}
                    className="accent-[#F86D72]"
                  />
                  In Stock
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === "outOfStock"}
                    onChange={() => setAvailability("outOfStock")}
                    className="accent-[#F86D72]"
                  />
                  Out of Stock
                </label>
              </div>
            </div>
          </aside>

          {/* Books */}
          <div>
            {message && (
              <div className="mb-5 rounded bg-green-100 p-3 text-center text-green-700">
                {message}
              </div>
            )}

            {currentBooks.length === 0 ? (
              <div className="rounded-xl border border-gray-200 p-12 text-center">
                <BookOpen className="mx-auto mb-3 text-gray-300" size={45} />

                <h3 className="font-semibold text-gray-700">No books found</h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {currentBooks.map((book) => (
                  <div
                    key={book._id}
                    className="relative flex h-full min-h-[500px] flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFavorite(book)}
                      className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
                      aria-label={
                        isFavorite(book._id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Heart
                        size={20}
                        className={
                          isFavorite(book._id)
                            ? "fill-[#F86D72] text-[#F86D72]"
                            : "text-gray-400"
                        }
                      />
                    </button>
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

                    <div className="mt-auto pt-5">
                      <div className="h-6 text-sm text-gray-500">
                        Stock: {book.stock}
                      </div>

                      <button
                        onClick={() => handleAddToCart(book._id)}
                        disabled={book.stock === 0}
                        className="mt-4 h-11 w-full rounded-lg bg-[#F86D72] px-4 font-medium text-white transition hover:bg-[#e95d63] disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {book.stock === 0 ? "Out of stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`h-9 w-9 rounded-md text-sm ${
                      currentPage === index + 1
                        ? "bg-[#F86D72] text-white"
                        : "border border-gray-200 text-gray-700 hover:border-[#F86D72]"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Products;
