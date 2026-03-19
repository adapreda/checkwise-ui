import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, User, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar = ({ isLoggedIn, onLogout }: NavbarProps) => {
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/checker", label: "Checker" },
    ...(isLoggedIn ? [{ to: "/dashboard", label: "Dashboard" }, { to: "/settings", label: "Settings" }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">✓</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Check<span className="text-primary">Wise</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="hidden items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:flex"
            >
              <LogOut size={14} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:cyber-glow-strong md:block"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground md:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(l.to) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <button onClick={() => { onLogout(); setMobileOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground">
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
