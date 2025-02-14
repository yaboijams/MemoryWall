import Link from "next/link";
import MobileNavbar from "./components/MobileNavbar";
import "./globals.css";

export const metadata = {
  title: "Memory Timeline",
  description: "Store and relive your cherished memories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <header
          className="p-4 shadow-md"
          style={{
            background: "linear-gradient(90deg, var(--primary), var(--secondary))",
            color: "var(--foreground)",
          }}
        >
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" legacyBehavior>
              <a>
                <h1 className="text-3xl font-bold">Memory Timeline</h1>
              </a>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li className="text-lg font-medium">
                  <Link href="/login" legacyBehavior>
                    <a className="hover:underline">Login</a>
                  </Link>
                </li>
                <li className="text-lg font-medium">
                  <Link href="/upload" legacyBehavior>
                    <a className="hover:underline">Upload</a>
                  </Link>
                </li>
                <li className="text-lg font-medium">
                  <Link href="/timeline" legacyBehavior>
                    <a className="hover:underline">Timeline</a>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileNavbar />
            </div>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
