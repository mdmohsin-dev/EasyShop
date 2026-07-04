"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, ImagePlus } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // useSession() loads asynchronously — on a fresh page load `session` is
  // undefined for the first render or two. A useState initializer only runs
  // once, so seeding it from session directly would freeze on that first
  // "not loaded yet" value. Syncing via effect keeps it up to date once the
  // real session (and its image URL) actually arrives.
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name);
      setImagePreview(session.user.image ?? null);
    }
  }, [session]);

  if (isPending || !session) {
    return <p className="p-8 text-sm text-muted">Loading…</p>;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    let imageUrl: string | undefined;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        setMessage(`Image upload failed: ${data.error ?? "unknown error"}`);
        setSaving(false);
        return;
      }
      imageUrl = (await uploadRes.json()).url;
    }

    const patchRes = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ...(imageUrl ? { image: imageUrl } : {}) }),
    });

    if (!patchRes.ok) {
      const data = await patchRes.json().catch(() => ({}));
      setMessage(`Save failed: ${data.error ?? "unknown error"}`);
      setSaving(false);
      return;
    }

    await refetch?.();
    setImageFile(null);
    setMessage("Saved.");
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold sm:text-3xl">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account info</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-surface-2 hover:bg-surface-2/70"
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-0.5 text-muted">
                    <UserCircle size={20} />
                    <ImagePlus size={11} />
                  </span>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label>Email</Label>
              <Input value={session.user.email} disabled />
            </div>

            <div>
              <Label>Role</Label>
              <Input value={session.user.role as string} disabled />
            </div>

            {message && (
              <p className={message.startsWith("Saved") ? "text-sm text-primary" : "text-sm text-danger"}>
                {message}
              </p>
            )}

            <Button type="submit" disabled={saving} className="mt-1">
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}