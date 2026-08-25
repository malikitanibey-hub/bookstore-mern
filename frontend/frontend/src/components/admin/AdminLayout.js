import {
  BookOpen,
  Home,
  Menu,
  PlusCircle,
  X,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const closeMobileSidebar = () => {
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-20 items-center border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
        {/* Mobile menu */}
        <button
          type="button"
          className="mr-3 inline-flex items-center justify-center rounded-md border border-slate-200 bg-transparent p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h4 className="text-lg font-bold text-slate-800">Admin Dashboard</h4>

        {/* Desktop sidebar toggle */}
        <button
          type="button"
          className="ml-auto hidden items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Open Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Main layout */}
      <div className="flex">
        {/* Mobile overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={closeMobileSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-20 z-50 h-[calc(100vh-5rem)]
            flex flex-col bg-slate-900 text-slate-100
            shadow-xl transition-all duration-300 ease-in-out

            md:sticky md:top-20 md:z-30 md:h-[calc(100vh-5rem)]

            ${
              open
                ? "translate-x-0 w-64"
                : "-translate-x-full w-64 md:translate-x-0"
            }

            ${collapsed ? "md:w-0 md:overflow-hidden" : "md:w-64"}
          `}
        >
          {/* Mobile close */}
          <button
            type="button"
            className="absolute right-2 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-red-600 p-0 text-slate-300 transition hover:bg-red-700 hover:text-white md:hidden"
            onClick={closeMobileSidebar}
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Sidebar content */}
          <nav className="mt-6 flex-1 space-y-2 p-3">
            {/* See All Books */}
            <NavLink
              to="/admin"
              end
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <BookOpen className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <span>See All Books</span>
            </NavLink>

            {/* Add Books */}
            <NavLink
              to="/admin/add-book"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <PlusCircle className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <span>Add Books</span>
            </NavLink>

            {/* Contact Messages */}
            <NavLink
              to="/admin/contact"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <MessageSquare className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <span>Contact Messages</span>
            </NavLink>

            {/* Return To Home */}
            <NavLink
              to="/"
              onClick={closeMobileSidebar}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Home className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <span>Return To Home Page</span>
            </NavLink>
          </nav>
        </aside>

        {/* Page content */}
        <main
          className={`
            min-w-0 flex-1 p-4 transition-all duration-300
            md:p-6
          `}
        >
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
