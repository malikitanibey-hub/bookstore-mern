import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Heart, ShoppingBasket } from "lucide-react";
import { useCart } from "../auth/CartContext";

function Header() {
  const { user, logout, loading, isAuthenticated, isAdmin } = useAuth();
  const { cart } = useCart();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const ref = React.useRef(null);

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const renderUserActions = () => {
    if (loading) {
      return (
        <div className="hidden md:flex items-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      );
    }
    if (!isAuthenticated) {
      return (
        <div className="hidden md:flex items-center gap-4">
          <svg
            className={`h-6 w-6 text-white transition-all duration-500 ${isScrolled ? "invert" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <button
            onClick={() => navigate("/login")}
            className={` ml-4 ${isScrolled ? "text-white bg-[#F86D72]" : "bg-[#F86D72] text-white"}`}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className={`ml-4 ${isScrolled ? "text-white bg-[#F86D72]" : "bg-[#F86D72] text-white"}`}
          >
            Sign Up
          </button>
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center gap-4">
        <span
          className={`text-sm ${isScrolled ? "text-gray-700" : "text-gray-700"}`}
        >
          Welcome, {user?.name}
        </span>

        {isAdmin ? (
          <button
            className="whitespace-nowrap w-44"
            onClick={() => navigate("/admin")}
          >
            Manage Dashboard
          </button>
        ) : (
          <>
            <div className="relative cursor-pointer">
              {cart && cart.totalItems > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cart.totalItems}
                </div>
              )}
              <a href="/cart">
                <ShoppingBasket />
              </a>
            </div>

            <Heart
              className="cursor-pointer"
              onClick={() => navigate("/favorites")}
              size={22}
            />
          </>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 bg-white w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
        <img src="/logo.png" className="h-32 object-contain" alt="Logo" />
      </a>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <NavLink
            key={i}
            to={link.path}
            end={link.path === "/"}
            className={({ isActive }) =>
              `group relative flex flex-col items-center gap-1 text-gray-700 transition-colors duration-300 ${
                isActive ? "text-[#F86D72]" : "hover:text-[#F86D72]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>{link.name}</span>

                <span
                  className={`h-0.5 bg-[#F86D72] transition-all duration-300 ease-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Desktop Right */}
      {renderUserActions()}

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <svg
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <a
          className="absolute top-4 right-4 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </a>

        {navLinks.map((link, i) => (
          <NavLink
            key={i}
            to={link.path}
            end={link.path === "/"}
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `group relative flex flex-col items-center gap-1 text-lg transition-colors duration-300 ${
                isActive
                  ? "text-[#F86D72]"
                  : "text-gray-800 hover:text-[#F86D72]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>{link.name}</span>

                <span
                  className={`h-0.5 bg-[#F86D72] transition-all duration-300 ease-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}

        {!isAuthenticated ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
              className="w-32 rounded-md bg-[#F86D72] px-4 py-2 text-white transition-all duration-300 hover:bg-[#cd595d]"
            >
              Login
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/signup");
              }}
              className="w-32 rounded-md bg-[#F86D72] px-4 py-2 text-white transition-all duration-300 hover:bg-[#cd595d]"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <>
            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>

            {isAdmin ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/admin");
                }}
                className="bg-[#F86D72] text-white px-4 py-2 rounded-md"
              >
                Manage Dashboard
              </button>
            ) : (
              <>
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/cart");
                  }}
                >
                  <div className="relative cursor-pointer">
                    {cart && cart.totalItems > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {cart.totalItems}
                      </div>
                    )}
                    <a href="/cart">
                      <ShoppingBasket />
                    </a>
                  </div>
                </a>

                <a
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/favorites");
                  }}
                >
                  <Heart
                    className="cursor-pointer"
                    onClick={() => navigate("/favorites")}
                    size={22}
                  />
                </a>
              </>
            )}

            <button
              onClick={async () => {
                setIsMenuOpen(false);
                await handleLogout();
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
