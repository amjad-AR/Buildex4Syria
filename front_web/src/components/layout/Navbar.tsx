import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'provider':
      return '/provider/dashboard';
    default:
      return '/dashboard';
  }
};

const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'provider':
      return 'Provider';
    default:
      return 'User';
  }
};

const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-500';
    case 'provider':
      return 'bg-emerald-500';
    default:
      return 'bg-amber-500';
  }
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  // useEffect to monitoring scroll to change the appearance of the navBar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect to monitoring the changes of page to do scrollToTop
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (user) {
      navigate(getDashboardPath(user.role));
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        isScrolled
          ? "bg-cream/95 backdrop-blur-xl py-3 shadow-lg shadow-petroleum/10 w-[92%] mx-auto rounded-2xl mt-3"
          : "bg-transparent py-6 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-petroleum-accent rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-cream font-display font-bold text-xl">
                B
              </span>
            </div>
            <span className="font-display font-semibold text-xl text-petroleum hidden sm:block group-hover:text-petroleum-accent transition-colors duration-300">
              Buildex4Syria
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative font-body font-medium text-petroleum transition-all duration-300 hover:text-petroleum-accent group px-2 py-1",
                  location.pathname === link.path && "text-petroleum-accent font-semibold"
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute -bottom-2 left-0 h-[3px] bg-petroleum-accent transition-all duration-300 ease-out rounded-full",
                    location.pathname === link.path
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-lg" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-petroleum/5 rounded-xl transition-all duration-300 hover:shadow-md group"
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105",
                        getRoleColor(user.role)
                      )}
                    >
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-petroleum group-hover:text-petroleum-accent transition-colors">
                        {user.username}
                      </p>
                      <p className="text-xs text-petroleum/70 font-medium">
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-cream/98 backdrop-blur-xl border border-petroleum/10 shadow-2xl shadow-petroleum/20 rounded-xl p-2 mt-2"
                >
                  <DropdownMenuLabel className="px-3 py-3 bg-gradient-to-r from-petroleum/5 to-petroleum-accent/5 rounded-lg mb-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md",
                          getRoleColor(user.role)
                        )}
                      >
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-petroleum truncate">{user.username}</p>
                        <p className="text-xs text-petroleum/70 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-petroleum/10 my-2" />
                  <DropdownMenuItem
                    onClick={handleDashboardClick}
                    className="cursor-pointer px-3 py-2.5 rounded-lg mx-1 mb-1 text-petroleum hover:bg-petroleum/10 hover:text-petroleum-accent transition-all duration-200 focus:bg-petroleum/10 focus:text-petroleum-accent"
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4 text-petroleum-accent" />
                    <span className="font-medium">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer px-3 py-2.5 rounded-lg mx-1 mb-1 text-petroleum hover:bg-petroleum/10 hover:text-petroleum-accent transition-all duration-200 focus:bg-petroleum/10 focus:text-petroleum-accent">
                    <User className="mr-3 h-4 w-4 text-petroleum-accent" />
                    <span className="font-medium">Profile</span>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/dashboard")}
                      className="cursor-pointer px-3 py-2.5 rounded-lg mx-1 mb-1 text-petroleum hover:bg-petroleum/10 hover:text-petroleum-accent transition-all duration-200 focus:bg-petroleum/10 focus:text-petroleum-accent"
                    >
                      <Settings className="mr-3 h-4 w-4 text-petroleum-accent" />
                      <span className="font-medium">Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-petroleum/10 my-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer px-3 py-2.5 rounded-lg mx-1 text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-all duration-200"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-petroleum font-body font-semibold hover:bg-petroleum/5 px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-petroleum hover:from-petroleum hover:to-petroleum-accent text-cream font-body font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-md">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 text-petroleum hover:bg-petroleum/5 rounded-lg transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden mt-4 bg-cream/95 backdrop-blur-xl rounded-2xl border border-petroleum/10 shadow-xl"
            >
              <div className="py-6 px-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block font-body font-medium text-lg text-petroleum py-3 px-4 rounded-xl transition-all duration-300 hover:text-petroleum-accent hover:bg-petroleum/5",
                      location.pathname === link.path && "text-petroleum-accent bg-petroleum/10 font-semibold"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Auth Section */}
                <div className="pt-4 mt-4 border-t border-petroleum/10">
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-petroleum/5 to-petroleum-accent/5 rounded-xl">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-md",
                            getRoleColor(user.role)
                          )}
                        >
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-petroleum">
                            {user.username}
                          </p>
                          <p className="text-sm text-petroleum/70 font-medium">
                            {getRoleLabel(user.role)}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleDashboardClick}
                        className="w-full bg-gradient-to-r from-petroleum-accent to-petroleum hover:from-petroleum hover:to-petroleum-accent text-cream font-body font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Go to Dashboard
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 font-body font-semibold py-3 rounded-xl transition-all duration-300"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full border-petroleum text-petroleum hover:bg-petroleum/5 font-body font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-md"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full bg-gradient-to-r from-petroleum-accent to-petroleum hover:from-petroleum hover:to-petroleum-accent text-cream font-body font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
