"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            S
          </span>
          SamCart
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link
            href="/"
            className={pathname === "/" ? "text-indigo-600" : "hover:text-slate-900"}
          >
            Marketplace
          </Link>
          {(role === "SELLER" || role === "ADMIN") && (
            <Link
              href="/seller/dashboard"
              className={pathname.startsWith("/seller") ? "text-indigo-600" : "hover:text-slate-900"}
            >
              Seller Dashboard
            </Link>
          )}
          {role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className={pathname.startsWith("/admin") ? "text-indigo-600" : "hover:text-slate-900"}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="ghost" size="sm">
                  Orders
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                  {session.user?.name?.split(" ")[0]}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </>
          ) : status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
