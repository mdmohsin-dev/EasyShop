"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCircle, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { signOut } from "@/lib/auth-client";

interface DashboardNavbarUser {
  name: string;
  email: string;
  image?: string | null;
}

interface DashboardNavbarProps {
  user: DashboardNavbarUser;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function DashboardNavbar({ user, sidebarOpen, onToggleSidebar }: DashboardNavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      {/* Sidebar toggle — same arrow controls it on every screen size */}
      <button
        onClick={onToggleSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-2"
        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-2"
        >
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2">
              <UserCircle size={18} />
            </span>
          )}
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-30 mt-2 w-52 rounded-md border border-border bg-surface p-1 shadow-md">
            <div className="px-2.5 py-2">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            <div className="my-1 border-t border-border" />
            <Link
              href="/dashboard/profile"
              onClick={() => setMenuOpen(false)}
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
    </header>
  );
}