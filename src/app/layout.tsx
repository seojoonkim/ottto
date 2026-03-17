import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ottto",
  description: "The most extreme agentic lab on earth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter Black — consistent heavy weight across all OS */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#000" }}>{children}</body>
    </html>
  );
}
