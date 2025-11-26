import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TravelQuest Okinawa",
  description: "Gamified route planning across Okinawa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon1.ico?v=2" />
      </head>
      <body className="min-h-screen bg-white text-gray-800 scrollbar-hide">
        {children}
        <footer
          className="bg-[#e74c3c] text-white py-4 text-center"
          style={{ fontFamily: '"glacial", sans-serif' }}
        >
          © {new Date().getFullYear()} TRAVELQUEST OKINAWA
        </footer>
      </body>
    </html>
  );
}
