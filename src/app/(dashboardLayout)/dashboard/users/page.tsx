"use client";

import { useEffect, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import { UserCircle } from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  createdAt: string;
}

function UsersList() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold sm:text-3xl">Users</h1>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border bg-surface">
                  <td className="flex items-center gap-2 px-4 py-3">
                    {u.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.image} alt={u.name} className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2">
                        <UserCircle size={15} />
                      </span>
                    )}
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        u.role === "ADMIN"
                          ? "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          : "rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-foreground/70"
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <RequireAdmin>
      <UsersList />
    </RequireAdmin>
  );
}
