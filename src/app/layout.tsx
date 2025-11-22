import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import { LedgerProvider } from "@/components/ledger-provider"
import { MembershipProvider } from "@/components/membership-provider"
import { TrialReminder } from "@/components/trial-reminder"
import { CapacitorInit } from "@/components/capacitor-init"
import { cookies } from "next/headers"
import { WelcomeGiftDialog } from "@/components/welcome-gift-dialog"

import { Nunito, ZCOOL_KuaiLe } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const zcool = ZCOOL_KuaiLe({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zcool",
  display: "swap",
});

export const metadata: Metadata = {
  title: "麻薯记账 - Mochi Book",
  description: "Q弹可爱的记账助手",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const showWelcome = cookieStore.get('fm_welcome_gift')?.value === 'true'

  return (
    <html lang="zh-CN">
      <body
        className={`antialiased bg-background ${nunito.variable} ${zcool.variable}`}
      >
        <CapacitorInit />
        <ThemeProvider>
          <MembershipProvider>
            <LedgerProvider>
              {children}
              <TrialReminder />
              <WelcomeGiftDialog show={showWelcome} />
              <Toaster position="top-center" />
            </LedgerProvider>
          </MembershipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
