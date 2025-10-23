import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Quest Okinawa",
  description: "Gamified route planning across Okinawa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Tailwind v4 сам подтянет все стили из globals.css */}
      <body className="min-h-screen bg-white text-gray-800">{children}</body>
    </html>
  );
}
