import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/authProvider";
import { Toaster } from "@/components/ui/toaster";
import TanstackProvider from "@/providers/TanstackProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "True Feedback",
  description: "Real feedback from real people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TanstackProvider>
        <AuthProvider>
          <body className={inter.className}>
            {children}
            <Toaster />
          </body>
        </AuthProvider>
      </TanstackProvider>
    </html>
  );
}
