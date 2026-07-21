"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, ImagePlus, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "login" | "register";

function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("login");
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  const [name, setName] = useState(""); // register only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function switchTab(next: Tab) {
    setTab(next);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (tab === "login") {
      const { error: signInError } = await signIn.email({ email, password });
      if (signInError) {
        setError(signInError.message || "Email or password is incorrect.");
        setSubmitting(false);
        return;
      }
    } else {
      const { error: signUpError } = await signUp.email({ name, email, password });
      if (signUpError) {
        setError(signUpError.message || "Could not create your account.");
        setSubmitting(false);
        return;
      }
    }

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        await fetch("/api/users/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: url }),
        });
      }
    }

    router.push(searchParams.get("redirect") || "/");
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-7 shadow-lg"
    >

      {/* tab switch */}
      <div className="mb-6 flex rounded-full bg-surface-2 p-1">
        <button
          type="button"
          onClick={() => switchTab("login")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-semibold transition-colors",
            tab === "login" ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
          )}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => switchTab("register")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-semibold transition-colors",
            tab === "register" ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
          )}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {tab === "register" && (

          <div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-surface-2 hover:bg-surface-2/70"
                title="Optional profile picture"
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-0.5 text-muted">
                    <UserIcon size={18} />
                    <ImagePlus size={11} />
                  </span>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <p className="my-2 text-center text-xs text-muted">Profile picture (optional)</p>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

          </div>


        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={tab === "register" ? 6 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" className="mt-1 rounded-full" disabled={submitting}>
          {submitting
            ? tab === "login"
              ? "Logging in…"
              : "Creating account…"
            : tab === "login"
              ? "Log in"
              : "Create account"}
        </Button>
      </form>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10 sm:px-6">
      <Suspense fallback={<div className="w-full text-center text-sm text-muted">Loading…</div>}>
        <AuthCard />
      </Suspense>
    </div>
  );
}