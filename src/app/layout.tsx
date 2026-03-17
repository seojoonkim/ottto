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
      <body style={{ margin: 0, padding: 0, background: "#000" }}>{children}</body>
    </html>
  );
}
