import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eliconsult | B2B Real Estate Consultancy",
  description:
    "Strategic advisory, market intelligence, and tailored real estate solutions for corporate clients, developers, and institutional partners.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
