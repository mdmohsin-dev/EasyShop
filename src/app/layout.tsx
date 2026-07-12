import type { Metadata } from "next";
import "./globals.css";
import ScrollToTopButton from "@/components/shared/ScrollToTopButton";

export const metadata: Metadata = {
  title: "Marchand — Shop",
  description: "A small, well-made goods shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}