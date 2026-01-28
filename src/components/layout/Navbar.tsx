"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-[#1E293B]">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[var(--primary)]">
          Gangwal IT Services
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/services">Services</Link>
          <Link href="/hire-developers">Hire Developers</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-[var(--bg)]">
          <Link onClick={() => setOpen(false)} href="/services">Services</Link>
          <Link onClick={() => setOpen(false)} href="/hire-developers">Hire Developers</Link>
          <Link onClick={() => setOpen(false)} href="/blog">Blog</Link>
          <Link onClick={() => setOpen(false)} href="/contact">Contact</Link>
        </div>
      )}
    </header>
  );
}
