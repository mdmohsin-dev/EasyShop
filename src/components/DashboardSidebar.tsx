"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  UserCircle,
  Home,
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface SidebarUser {
  name: string;
  email: string;
  image?: string | null;
  role: string;
}

const ADMIN_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/orders", label: "Orders", icon: ClipboardList },
];

const CUSTOMER_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "My Orders", icon: ClipboardList },
];

export default function DashboardSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const links = user.role === "ADMIN" ? ADMIN_LINKS : CUSTOMER_LINKS;

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-surface">
      {/* Top: collapse toggle (desktop only) */}
      <div className="flex items-center justify-between border-b border-border p-3">
        {!collapsed && <span className="px-2 text-xs font-semibold uppercase tracking-wide text-muted">Dashboard</span>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden h-8 w-8 items-center justify-center rounded-md hover:bg-surface-2 md:flex"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-2 md:hidden"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 p-2">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? link.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                active ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-surface-2"
              )}
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Home, Profile, Logout */}
      <div className="space-y-1 border-t border-border p-2">
        <Link
          href="/"
          title={collapsed ? "Back to site" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/75 hover:bg-surface-2",
            collapsed && "justify-center px-0"
          )}
        >
          <Home size={17} className="shrink-0" />
          {!collapsed && <span>Back to site</span>}
        </Link>

        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen((o) => !o)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-2",
              collapsed && "justify-center px-0"
            )}
          >
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="h-7 w-7 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2">
                <UserCircle size={17} />
              </span>
            )}
            {!collapsed && <span className="truncate">{user.name}</span>}
          </button>

          {profileMenuOpen && (
            <div className={cn("absolute bottom-full z-30 mb-1 w-48 rounded-md border border-border bg-surface p-1 shadow-md", collapsed ? "left-full ml-2" : "left-0")}>
              <Link
                href="/dashboard/profile"
                onClick={() => setProfileMenuOpen(false)}
                className="block rounded px-2.5 py-1.5 text-sm hover:bg-surface-2"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-sm text-danger hover:bg-danger/10"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: floating open button */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-4 left-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Desktop sidebar */}
      <aside className={cn("hidden shrink-0 border-r border-border transition-all duration-200 md:block", collapsed ? "w-16" : "w-56")}>
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 animate-float-in border-r border-border">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}
