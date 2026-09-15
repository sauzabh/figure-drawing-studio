import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Figure Drawing Studio & Anatomy Reference",
  description: "A premium digital figure-drawing studio and anatomy reference for artists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">{children}</body>
    </html>
  );
}
