"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";

interface DashboardUser {
  name: string;
  email: string;
  image?: string | null;
  role: string;
}

export default function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  // Same state drives both: on desktop it toggles the sidebar between full
  // width and icon-only; on mobile it toggles between fully hidden and an
  // overlay drawer. Starts closed everywhere.
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={user} open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardNavbar user={user} sidebarOpen={open} onToggleSidebar={() => setOpen((o) => !o)} />
        <main className="w-full flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}