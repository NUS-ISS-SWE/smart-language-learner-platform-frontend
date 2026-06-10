import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Smart Language Learner Platform",
  description: "A focused writing environment for learners to create compositions, receive AI-assisted feedback, and improve language expression.",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryProvider>
            <I18nProvider>{children}</I18nProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
