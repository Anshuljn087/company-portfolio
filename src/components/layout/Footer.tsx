import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-[var(--muted)]">

        <div>
          <h3 className="text-[var(--text)] font-semibold mb-3">YourCompany</h3>
          <p>
            We provide dedicated developers and end-to-end software development services.
          </p>
        </div>

        <div>
          <h4 className="text-[var(--text)] font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/hire-developers">Hire Developers</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[var(--text)] font-semibold mb-3">Contact</h4>
          <p>Email: contact@yourcompany.com</p>
          <p>India | Remote Worldwide</p>
        </div>

      </div>
    </footer>
  );
}
