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
import { InstallPrompt } from "@/components/install-prompt"

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
      <head>
        {/* PWA 相关 Meta 标签 */}
        <meta name="application-name" content="麻薯记账" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="麻薯记账" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* iOS Safari 特定 */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192x192.png" />
        
        {/* iOS Safari 启动画面 */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash-iphone-15-pro-max.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash-iphone-15-pro.png"
        />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#14b8a6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
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
              <InstallPrompt />
              <Toaster position="top-center" />
            </LedgerProvider>
          </MembershipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
