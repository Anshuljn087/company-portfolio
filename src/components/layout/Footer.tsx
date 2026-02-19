import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-[var(--muted)]">
        <div>
          <Link
            href="/"
            className="text-[var(--text)] font-semibold mb-3 block"
          >
            <Image
              src="/gangwal-logo.jpg"
              alt="Gangwal IT Services"
              width={100}
              height={100}
              priority
            />
          </Link>
          <p>
            We provide dedicated developers and end-to-end software development
            services.
          </p>
        </div>

        <div>
          <h4 className="text-[var(--text)] font-semibold mb-3">Quick Links</h4>

          <ul className="space-y-2">
            <li>
              <Link
                href="/careers"
                className="hover:text-[var(--primary)] transition"
              >
                Careers
              </Link>
            </li>

            <li>
              <Link
                href="/blog"
                className="hover:text-[var(--primary)] transition"
              >
                Blog
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="hover:text-[var(--primary)] transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[var(--text)] font-semibold mb-3">Contact</h4>
          <p>Email: sonal.godha@gangwalitservices.com</p>
          <p>India | Remote Worldwide</p>
        </div>
      </div>
    </footer>
  );
}
