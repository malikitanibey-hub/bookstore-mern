import {
  BookOpen,
  Home,
  Menu,
  PlusCircle,
  X,
  MessageSquare,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="stick flex items-center top-0 z-30 shadow-lg h-20">
        <button
          className="md:hidden inline-flex item-center justify-center
          !bg-transparent !border-none !text-black
          rounded-md border border-slate-200 p-2"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h4 className="font-bold">Admin Dashboard</h4>
      </header>

      {/* Sidebar */}
      <div className="relative mx-auto flex">
        <aside
          className={`sticky top-0 h-screen flex flex-col transition-transform bg-slate-900 w-64 text-slate-100 ${
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <a
            className="md:hidden rounded-md p-2 hover:bg-slate-800
                   !bg-transparent !text-white absolute right-0 cursor-pointer"
            onClick={() => setOpen(false)}
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </a>

          <nav className="flex-1 space-y-2 p-3 mt-15">
            {/* See All Books */}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <BookOpen className="h-5 w-5" strokeWidth={2.5} />
              <span>See All Books</span>
            </NavLink>

            {/* Add Books */}
            <NavLink
              to="/admin/add-book"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <PlusCircle className="h-5 w-5" strokeWidth={2.5} />
              <span>Add Books</span>
            </NavLink>

            {/* Contact Messages */}
            <NavLink
              to="/admin/contact"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <MessageSquare className="h-5 w-5" strokeWidth={2.5} />
              <span>Contact Messages</span>
            </NavLink>

            {/* Return To Home */}
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Home className="h-5 w-5" strokeWidth={2.5} />
              <span>Return To Home Page</span>
            </NavLink>
          </nav>
        </aside>

        <main className="w-full md:ml-64 p-4 md:p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
