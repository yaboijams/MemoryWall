import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import "./globals.css";

export const metadata = {
  title: "Memory Timeline",
  description: "Store and relive your cherished memories.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="min-h-screen"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <Header />
        {/* Wrap the main content in ProtectedRoute */}
        <ProtectedRoute>
          <main className="p-4">{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
