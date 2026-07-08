import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Submission System",
  description: "User registration and document submission with admin management.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-950">{children}</body>
    </html>
  );
}
