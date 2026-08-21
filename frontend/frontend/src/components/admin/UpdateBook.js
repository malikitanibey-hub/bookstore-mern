import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/books/updateBook/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      const data = await res.json();
      setMessage(data.message);
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/books/deleteBook/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setShowDeletePopup(false);
      setMessage(data.message);
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (loading)
    return (
      <div className=" flex justify-center items-center mt-44">
        <div className="w-10 h-10 border-4 border-[#F86D72] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto mt-44 p-6 bg-white shadow rounded">
      <h3 className="mb-5">Update Book</h3>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <input
        className="border p-2 w-full mb-3"
        type="text"
        name="title"
        value={book.title || ""}
        onChange={handleChange}
        placeholder="Title"
      />

      <input
        className="border p-2 w-full mb-3"
        type="text"
        name="author"
        value={book.author || ""}
        onChange={handleChange}
        placeholder="Author"
      />

      <textarea
        className="border p-2 w-full mb-3"
        name="description"
        value={book.description || ""}
        onChange={handleChange}
        placeholder="Description"
      />

      <input
        className="border p-2 w-full mb-3"
        type="number"
        name="price"
        value={book.price || ""}
        onChange={handleChange}
        placeholder="Price"
      />

      <input
        className="border p-2 w-full mb-3"
        type="number"
        name="stock"
        value={book.stock || ""}
        onChange={handleChange}
        placeholder="Stock"
      />

      <div className="flex justify-between mt-4">
        <button onClick={handleUpdate}>Update</button>

        <button
          className="!bg-red-600"
          onClick={() => setShowDeletePopup(true)}
        >
          Delete
        </button>
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-3">Delete Book</h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this book?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateBook;
