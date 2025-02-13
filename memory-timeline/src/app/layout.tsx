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
      {/* The body uses your custom background and foreground colors */}
      <body
        className="min-h-screen"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        {/* Header uses the primary color for background */}
        <header
          className="p-4"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--foreground)",
          }}
        >
          <h1 className="text-2xl font-bold">Memory Timeline</h1>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
