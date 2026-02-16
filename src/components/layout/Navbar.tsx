"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-[#1E293B]">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[var(--primary)]"
        >
          Gangwal IT Services
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/services" className="hover:text-[var(--primary)]">
            Services
          </Link>
          <Link href="/hire-developers" className="hover:text-[var(--primary)]">
            Hire Developers
          </Link>
          <Link href="/careers" className="hover:text-[var(--primary)]">
            Careers
          </Link>
          <Link href="/blog" className="hover:text-[var(--primary)]">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-[var(--primary)]">
            Contact
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white"
          >
            Get Quote
          </Link>
        </div>

        {/* Mobile Burger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(true)}
          aria-label="Open Menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden">
          <div className="absolute right-0 top-0 h-full w-72 bg-[#020617] p-6 flex flex-col gap-6">
            {/* Close */}
            <button
              className="self-end text-xl"
              onClick={() => setOpen(false)}
              aria-label="Close Menu"
            >
              ✕
            </button>

            <Link href="/services" onClick={() => setOpen(false)}>
              Services
            </Link>

            <Link href="/hire-developers" onClick={() => setOpen(false)}>
              Hire Developers
            </Link>

            <Link href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>

            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-center"
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
