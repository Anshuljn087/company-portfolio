import Navbar from "@/src/components/layout/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/src/components/layout/Footer";

export const metadata: Metadata = {
  title: "Your Company Name",
  description: "IT Services & Dedicated Development Team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
