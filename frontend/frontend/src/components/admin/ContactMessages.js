import React, { useEffect, useState } from "react";
import { X, Mail, User, Calendar, MessageSquare } from "lucide-react";

function ContactMessages() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:5000/contact");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch messages");
        }

        setContacts(data.contacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError("Failed to load contact messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Contact Messages</h1>

        <p className="mt-2 text-slate-500">
          Manage messages sent by your customers.
        </p>
      </div>

      {/* Messages */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {contacts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-500">No contact messages yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Subject
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {contact.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {contact.email}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {contact.subject}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                        {contact.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="font-medium text-white transition hover:text-slate-100"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Contact Details Modal */}
{selectedContact && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Contact Message
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Message details
          </p>
        </div>

        <a
          onClick={() => setSelectedContact(null)}
          className="rounded-lg p-2 bg-[#F86D72] text-white transition hover:bg-[#cd595d] hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </a>
      </div>

      {/* Content */}
      <div className="space-y-6 p-6">

        {/* Name */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <User className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Name
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {selectedContact.name}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <Mail className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Email
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {selectedContact.email}
            </p>
          </div>
        </div>

        {/* Subject */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <MessageSquare className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Subject
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {selectedContact.subject}
            </p>
          </div>
        </div>

        {/* Message */}
        <div>
          <p className="mb-2 text-sm font-medium text-slate-500">
            Message
          </p>

          <div className="rounded-xl bg-slate-50 p-4 leading-7 text-slate-700">
            {selectedContact.message}
          </div>
        </div>

        {/* Date + Status */}
        <div className="flex flex-wrap gap-6 border-t border-slate-200 pt-5">

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />

            <span className="text-sm text-slate-600">
              {new Date(
                selectedContact.createdAt
              ).toLocaleString()}
            </span>
          </div>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold capitalize text-yellow-700">
            {selectedContact.status}
          </span>

        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-slate-200 px-6 py-4">
        <button
          onClick={() => setSelectedContact(null)}
          className="rounded-lg bg-[#F86D72] px-6 py-2.5 font-semibold text-white transition hover:bg-[#cd595d]"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactMessages;
