import React, { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const administrators = users.filter((user) => user.role === "admin");
  const customers = users.filter((user) => user.role === "user");

      const handleToggleStatus = async (user) => {
  try {
    setActionLoading(user._id);

    const action =
      user.status === "suspended" ? "activate" : "suspend";

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users/admin/${user._id}/${action}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update user");
    }

    setUsers((prevUsers) =>
      prevUsers.map((item) =>
        item._id === user._id
          ? {
              ...item,
              status:
                action === "suspend"
                  ? "suspended"
                  : "active",
            }
          : item
      )
    );
  } catch (error) {
    console.error("Error updating user:", error);
    setError(error.message);
  } finally {
    setActionLoading(null);
  }
};

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/admin/all`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        console.log("Users:", data.users);

        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();


  }, []);

if (loading) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#F86D72]"></div>
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
  <div className="p-4 sm:p-6">

    {/* Header */}
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Users
      </h1>

      <p className="mt-2 text-sm text-slate-500 sm:text-base">
        Manage users registered on your website.
      </p>
    </div>

    {/* ================= ADMINISTRATORS ================= */}
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Administrators
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {administrators.length} administrator
            {administrators.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {administrators.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500">
              No administrators found.
            </p>
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
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {administrators.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium capitalize text-purple-700">
                        Administrator
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {/* ================= CUSTOMERS ================= */}
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Customers
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {customers.length} customer
          {customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
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
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Joined
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {customers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        user.status === "suspended"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.status || "active"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="px-6 py-4">
<button
  type="button"
  onClick={() => handleToggleStatus(user)}
  disabled={actionLoading === user._id}
  className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
    user.status === "suspended"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-[#F86D72] hover:bg-[#cd595d]"
  }`}
>
  {actionLoading === user._id
    ? "Updating..."
    : user.status === "suspended"
    ? "Activate"
    : "Suspend"}
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-slate-200 md:hidden">
          {customers.map((user) => (
            <div
              key={user._id}
              className="p-4 transition hover:bg-slate-50 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900">
                    {user.name}
                  </h3>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    user.status === "suspended"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.status || "active"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>

<button
  type="button"
  onClick={() => handleToggleStatus(user)}
  disabled={actionLoading === user._id}
  className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
    user.status === "suspended"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-[#F86D72] hover:bg-[#cd595d]"
  }`}
>
  {actionLoading === user._id
    ? "Updating..."
    : user.status === "suspended"
    ? "Activate"
    : "Suspend"}
</button>
              </div>
            </div>
          ))}
        </div>

        {customers.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500">
              No customers found.
            </p>
          </div>
        )}
      </div>
    </div>

  </div>
);
}

export default Users;