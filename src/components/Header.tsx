
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold">
            BlogMingle
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                className="text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Write
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-1">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-300">
                      <img
                        src={user?.profilePicture || "https://i.pravatar.cc/150?u=unknown"}
                        alt={user?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-posts")}>
                    My Posts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/favorites")}>
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          )}
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 right-0 left-0 bg-white shadow-md md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Write
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-posts"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Posts
                  </Link>
                  <Link
                    to="/favorites"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                  <button
                    className="block w-full px-3 py-2 text-left text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
