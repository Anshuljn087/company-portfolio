export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-[var(--muted)]">
        
        {/* Company */}
        <div>
          <h3 className="text-[var(--text)] font-semibold mb-3">
            YourCompany
          </h3>
          <p>
            We provide dedicated developers and end-to-end software development
            services for startups and enterprises.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-[var(--text)] font-semibold mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>Services</li>
            <li>Hire Developers</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[var(--text)] font-semibold mb-3">
            Contact
          </h4>
          <p>Email: contact@yourcompany.com</p>
          <p>India | Remote Worldwide</p>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--muted)] pb-6">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
}
