import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sairaCondensed = localFont({
  src: "../../public/fonts/SairaCondensed-Regular.ttf",
  variable: "--font-saira",
  fallback: ["Arial", "sans-serif"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ottodon",
  description: "Things for everything.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sairaCondensed.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
