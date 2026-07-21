import Link from "next/link";
import { ShoppingBag, Mail, Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingBag size={18} />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">Marchand</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Well-made things, plainly priced. A small shop for goods that last.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="mailto:hello@marchand.shop" aria-label="Email" className="text-muted hover:text-foreground">
                <Mail size={18} />
              </a>
              <a href="#" aria-label="Website" className="text-muted hover:text-foreground">
                <Globe size={18} />
              </a>
              <a href="#" aria-label="Community" className="text-muted hover:text-foreground">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Shop</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li><Link href="/shop" className="text-foreground/75 hover:text-foreground">All products</Link></li>
              <li><Link href="/shop?category=ELECTRONICS" className="text-foreground/75 hover:text-foreground">Electronics</Link></li>
              <li><Link href="/shop?category=ACCESSORIES" className="text-foreground/75 hover:text-foreground">Accessories</Link></li>
              <li><Link href="/shop?category=APPAREL" className="text-foreground/75 hover:text-foreground">Apparel</Link></li>
              <li><Link href="/cart" className="text-foreground/75 hover:text-foreground">Cart</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Account</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li><Link href="/login" className="text-foreground/75 hover:text-foreground">Log in</Link></li>
              <li><Link href="/dashboard" className="text-foreground/75 hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/dashboard/orders" className="text-foreground/75 hover:text-foreground">Orders</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Support</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li><a href="mailto:hello@marchand.shop" className="text-foreground/75 hover:text-foreground">hello@marchand.shop</a></li>
              <li><span className="text-foreground/75">Shipping & returns</span></li>
              <li><span className="text-foreground/75">Privacy policy</span></li>
              <li><span className="text-foreground/75">Terms of service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Marchand. All rights reserved.</p>
          <p>Payments secured by SSLCommerz</p>
        </div>
      </div>
    </footer>
  );
}