import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// The import path is still correct because `@/` points to the `src` directory.
import { GraphicsProvider } from "@/hooks/useGraphicsSettings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atom Builder",
  description: "Build the universe, one atom at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GraphicsProvider>
          {children}
        </GraphicsProvider>
      </body>
    </html>
  );
}
