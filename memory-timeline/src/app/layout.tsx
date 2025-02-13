import Link from "next/link";
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
          className="p-4"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--foreground)",
          }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Memory Timeline</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="hover:underline">
                    Upload
                  </Link>
                </li>
                <li>
                  <Link href="/timeline" className="hover:underline">
                    Timeline
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
