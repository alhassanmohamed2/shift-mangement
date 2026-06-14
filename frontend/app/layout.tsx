import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });

export const metadata: Metadata = {
  title: "Shift Management",
  description: "IT Shift Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-slate-900 text-white min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
        </AuthProvider>
      </body>
    </html>
  );
}
