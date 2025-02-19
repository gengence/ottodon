import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${sairaCondensed.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
