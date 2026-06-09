import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "SmartLangLearn – Language Learning Platform",
  description:
    "An intelligent language learning platform powered by microservices.",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>
          <QueryProvider>
            <I18nProvider>{children}</I18nProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
