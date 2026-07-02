"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, ShoppingCart, LayoutDashboard, User as UserIcon, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "All Products" },
  { href: "/dashboard", label: "Dashboard", protected: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const visibleLinks = navLinks.filter((link) => !link.protected || user);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShoppingBag size={18} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">EasyShop</span>
        </Link>

        {/* Center nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {visibleLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1",
                  active ? "text-primary" : "text-foreground/70 hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-2">
            <ShoppingCart size={19} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2">
                  <UserIcon size={13} />
                </span>
                <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted">{user.role}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button size="sm">Log in</Button>
            </Link>
          )}

          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-2"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-1 animate-float-in">
          {visibleLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                  active ? "bg-surface-2 text-primary" : "text-foreground/80"
                )}
              >
                {link.href === "/dashboard" && <LayoutDashboard size={15} />}
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 border-t border-border pt-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-danger"
              >
                <LogOut size={15} /> Log out ({user.name})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-primary"
              >
                <UserIcon size={15} /> Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
