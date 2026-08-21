import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../auth/AuthContext'

function AddBook() {
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const { isAuthenticated, isAdmin, user, loading } = useAuth()
  const navigate = useNavigate();

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

  useEffect(() => {

    if (loading) return
    if (!isAuthenticated || !isAdmin) {
        navigate("/", { replace: true })
          return
    }

    const loadingCats = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/category/getCategories`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data?.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCats(false);
      }
    };

    loadingCats();
  }, [loading, isAuthenticated, isAdmin, navigate]);

  const onChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type == "file") {
      const file = files?.[0] || null;
      setForm((p) => ({ ...p, [name]: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
      return;
    }

    if (type == "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!isAuthenticated || !isAdmin) {
      navigate("/", { replace: true })
      return
    }

    if (
      !form.title ||
      !form.author ||
      !form.description ||
      !form.price ||
      !form.stock
    ) {
      setMsg(
        "❌ All fields (title, author, description, price, stock) are required.",
      );
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("author", form.author);
    fd.append("description", form.description);
    fd.append("price", String(form.price));
    fd.append("stock", String(form.stock));

    if (form.category) {
      fd.append("category", form.category);
    }

    fd.append("isFeatured", String(form.isFeatured));
    fd.append("isOnSale", String(form.isOnSale));

    if (form.coverImage) {
      fd.append("coverImage", form.coverImage);
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/createBook`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json().catch(() => ({}))

      if (res.status === 401 || res.status === 403) {
        setMsg("❌ Not authorized");
        navigate("/", { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create book");
      }
      setMsg("Book Added Successfully");
      setForm({
        title: "",
        author: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        discountPercent: "",
        isFeatured: false,
        isOnSale: false,
        discountPercent: false,
        coverImage: null,
      });
      setPreview(null);
    } catch (error) {
      setMsg("❌", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null
  if (!isAuthenticated || !isAdmin) return null

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Book</h2>

      <form
        onSubmit={onSubmit}
        className="bg-white border border-slate-200 rounded-xl p-5 space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Book title"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Author *</label>
            <input
              name="author"
              value={form.author}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Author name"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Price *</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. 19.99"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Stock *</label>
            <input
              type="number"
              name="stock"
              min="0"
              step="1"
              value={form.stock}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. 20"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Write a short description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              disabled={loadingCats}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300 bg-white"
            >
              <option value="">
                {loadingCats ? "Loading..." : "Select category"}
              </option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Discount Percent</label>
            <input
              type="number"
              name="discountPercent"
              min="0"
              max="100"
              step="1"
              value={form.discountPercent}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. 10"
            />
          </div>

          <div className="flex items-center gap-6 md:col-span-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm">Featured</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.discountPercent}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm">discount Percent</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isOnSale"
                checked={form.isOnSale}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm">On Sale</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={onChange}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />

            {/* Preview */}
            {preview && (
              <div className="mt-3">
                <p className="text-sm text-slate-500 mb-1">Preview:</p>
                <img
                  src={preview}
                  alt="preview"
                  className="h-40 w-40 object-cover rounded-lg border border-slate-200"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center whitespace-nowrap justify-center rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Create Book"}
        </button>

        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </div>
  );
}

export default AddBook;
