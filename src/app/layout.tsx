import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Dashboard | Code12",
  description: "Dashboard Powered by Code12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">

      <body className="bg-slate-200">
        {children}
      </body>
    </html>
  );
}
