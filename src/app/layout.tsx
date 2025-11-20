import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import { LedgerProvider } from "@/components/ledger-provider"
import { MembershipProvider } from "@/components/membership-provider"
import { TrialReminder } from "@/components/trial-reminder"
import { CapacitorInit } from "@/components/capacitor-init"

export const metadata: Metadata = {
  title: "FlowMoney - 心流记账",
  description: "记录生活，治愈自己",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#14b8a6", // teal-500
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zoom on mobile inputs
  viewportFit: "cover", // 支持安全区域（刘海屏、底部手势条）
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`antialiased bg-gray-50`}
      >
        <CapacitorInit />
        <ThemeProvider>
          <MembershipProvider>
            <LedgerProvider>
              {children}
              <TrialReminder />
              <Toaster position="top-center" />
            </LedgerProvider>
          </MembershipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
