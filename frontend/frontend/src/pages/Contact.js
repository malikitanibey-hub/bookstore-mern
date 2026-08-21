import React, { useState } from "react";
import { Mail, MapPin, Phone, Clock, CheckCircle } from "lucide-react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Show success modal
      setSuccess(true);

      // Clear form
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative mt-[150px] h-[420px] bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: "url('/contactus-hero.jpg')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>

            <p className="text-lg md:text-xl text-gray-200 mb-5">
              We'd love to hear from you
            </p>

            <div className="w-24 h-1 bg-[#F86D72]"></div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Contact Us</h2>

            <p className="mt-4 leading-7 text-slate-600">
              Whether you have a question about a book, your order, or anything
              else, feel free to contact us.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-slate-100 p-3">
                  <MapPin size={22} className="text-slate-800" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">Address</h3>
                  <p className="mt-1 text-slate-600">Beirut, Lebanon</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-slate-100 p-3">
                  <Mail size={22} className="text-slate-800" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">Email</h3>
                  <p className="mt-1 text-slate-600">info@bookstore.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-slate-100 p-3">
                  <Phone size={22} className="text-slate-800" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">Phone</h3>
                  <p className="mt-1 text-slate-600">+961 1 234 567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-slate-100 p-3">
                  <Clock size={22} className="text-slate-800" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Opening Hours
                  </h3>
                  <p className="mt-1 text-slate-600">
                    Monday - Saturday: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is your message about?"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="6"
                  required
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#F86D72] px-6 py-3 font-semibold text-white transition hover:bg-[#cd595d] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
            {/* Success Modal */}
            {success && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
                  {/* Success Icon */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-9 w-9 text-green-600" />
                  </div>

                  {/* Title */}
                  <h2 className="mt-5 text-2xl font-bold text-slate-900">
                    Message Sent!
                  </h2>

                  {/* Message */}
                  <p className="mt-3 text-slate-600 leading-6">
                    Thank you for contacting us. Your message has been
                    successfully submitted. We'll get back to you soon.
                  </p>

                  {/* Button */}
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-7 rounded-lg bg-[#F86D72] px-8 py-3 font-semibold text-white transition hover:bg-[#cd595d]"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">Find Us</h2>

          <div className="h-[400px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <iframe
              title="BookStore Location"
              src="https://www.google.com/maps?q=Beirut,Lebanon&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
