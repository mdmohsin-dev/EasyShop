"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  UserCircle,
  Home,
  LogOut,
  X,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface SidebarUser {
  name: string;
  email: string;
  image?: string | null;
  role: string;
}

interface DashboardSidebarProps {
  user: SidebarUser;
  open: boolean;
  onClose: () => void;
}

const ADMIN_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/shop", label: "Products", icon: Package },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/orders", label: "Orders", icon: ClipboardList },
];

const CUSTOMER_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "My Orders", icon: ClipboardList },
];

function SidebarBody({
  user,
  links,
  collapsed,
  onNavigate,
  onLogout,
  onCloseButtonClick,
}: {
  user: SidebarUser;
  links: typeof ADMIN_LINKS;
  collapsed: boolean;
  onNavigate: () => void;
  onLogout: () => void;
  onCloseButtonClick?: () => void;
}) {
  const pathname = usePathname();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Logo — the open/close arrow lives in the top navbar on desktop;
          on mobile an X shows here in the top-right corner instead. */}
      <div className="flex items-center justify-between border-b border-border p-[15px]">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShoppingBag size={18} />
          </span>
          {!collapsed && (
            <span className="truncate font-display text-base font-semibold tracking-tight">Marchand</span>
          )}
        </Link>

        {onCloseButtonClick && (
          <button
            onClick={onCloseButtonClick}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-surface-2"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
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
                onClick={onLogout}
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
}

export default function DashboardSidebar({ user, open, onClose }: DashboardSidebarProps) {
  const router = useRouter();
  const links = user.role === "ADMIN" ? ADMIN_LINKS : CUSTOMER_LINKS;

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Desktop: stays in the layout, toggles between full width and icon-only.
          Never fully hidden on md+ screens. */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-border transition-all duration-200 md:block",
          open ? "w-56" : "w-16"
        )}
      >
        <SidebarBody user={user} links={links} collapsed={!open} onNavigate={() => {}} onLogout={handleLogout} />
      </aside>

      {/* Mobile: always mounted (never unmounted), so both opening AND
          closing animate smoothly via CSS transitions on transform/opacity
          instead of the drawer just vanishing instantly on close. */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={onClose}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-64 border-r border-border transition-transform duration-300 ease-in-out",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarBody
            user={user}
            links={links}
            collapsed={false}
            onNavigate={onClose}
            onLogout={handleLogout}
            onCloseButtonClick={onClose}
          />
        </aside>
      </div>
    </>
  );
}