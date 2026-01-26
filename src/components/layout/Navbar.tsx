"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-[#1E293B]">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[var(--primary)]">
          YourCompany
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/services" className="hover:text-[var(--primary)]">
            Services
          </Link>
          <Link href="/hire-developers" className="hover:text-[var(--primary)]">
            Hire Developers
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

        {/* Mobile Button */}
        <button
          className="md:hidden text-[var(--text)]"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-4 text-sm">
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
        </div>
      )}
    </header>
  );
}
