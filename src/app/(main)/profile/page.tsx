"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  LogOut,
  Settings,
  ChevronRight,
  Book,
  FileSpreadsheet,
  Bell,
  Palette,
  MessageCircle,
  PiggyBank,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAllTransactionsForExport } from "@/app/actions/export";
import { toast } from "sonner";
import { useMembership } from "@/components/membership-provider";
import { useTheme, THEME_VARIANTS } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { AvatarUpload } from "@/components/avatar-upload";

export default function ProfilePage() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const { isPro, isTrial, trialDaysLeft, profile, loading, refreshProfile } =
    useMembership();
  const { primaryColor } = useTheme();
  const theme = THEME_VARIANTS[primaryColor];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleExport = async () => {
    if (!isPro) {
      toast.error("导出功能仅限 Pro 会员使用");
      router.push("/profile/pro");
      return;
    }

    setExporting(true);
    try {
      const data = await getAllTransactionsForExport();
      if (!data || data.length === 0) {
        toast.error("暂无数据可导出");
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row: any) =>
        Object.values(row)
          .map((v) => `"${v}"`)
          .join(",")
      );
      const csvContent = "\uFEFF" + [headers, ...rows].join("\n"); // Add BOM for Excel

      // Trigger Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `flow_money_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("导出成功");
    } catch (e) {
      console.error(e);
      toast.error("导出失败");
    } finally {
      setExporting(false);
    }
  };

  const displayName =
    profile?.display_name || profile?.email || "FlowMoney 用户";
  const avatarUrl = profile?.avatar_url || "https://github.com/shadcn.png";
  const badgeText = isPro ? (isTrial ? "Pro 体验中" : "Pro 会员") : "Free 用户";
  const proBadge = (
    <span className="flex items-center gap-1 text-[10px] font-medium text-yellow-600">
      <Crown className="w-3 h-3" /> Pro
    </span>
  );

  const featureItems = [
    {
      icon: Book,
      label: "账本管理",
      value: isPro ? "多账本" : proBadge,
      href: "/profile/ledgers",
      proOnly: true,
    },
    {
      icon: FileSpreadsheet,
      label: exporting ? "导出中..." : "数据导出 (CSV/Excel)",
      value: isPro ? "CSV" : proBadge,
      action: handleExport,
      proOnly: true,
    },
    {
      icon: Palette,
      label: "个性化主题",
      value: isPro ? "自定义" : proBadge,
      href: "/profile/theme",
      proOnly: true,
    },
    {
      icon: PiggyBank,
      label: "存钱罐",
      value: isPro
        ? profile?.monthly_savings_enabled
          ? "已开启"
          : "未开启"
        : proBadge,
      href: "/profile/savings",
      proOnly: true,
    },
    {
      icon: Bell,
      label: "记账提醒",
      value: isPro ? "每日" : proBadge,
      href: "/profile/settings",
      proOnly: true,
    },
  ];

  const handleFeatureClick = (item: (typeof featureItems)[number]) => {
    if (item.proOnly && !isPro) {
      toast.error("此功能为 Pro 会员专享");
      router.push("/profile/pro");
      return;
    }
    if (item.action) {
      item.action();
      return;
    }
    if (item.href) router.push(item.href);
  };

  return (
    <div className="p-4 pb-4 space-y-6">
      {/* Header / Profile Card */}
      <div className="flex flex-col items-center pt-4 pb-6">
        <AvatarUpload
          currentAvatarUrl={avatarUrl}
          displayName={displayName}
          onUploadSuccess={refreshProfile}
          size="lg"
          className="mb-3"
        />
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          {displayName}
          {isPro && (
            <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          )}
        </h1>
        <div className="flex items-center gap-1 mt-1">
          <Badge
            variant="secondary"
            className={`${
              isPro
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-600"
            } hover:bg-gray-200 text-[10px] h-5`}
          >
            {badgeText}
          </Badge>
        </div>
        {isTrial && (
          <div className="text-[11px] text-yellow-700 mt-1">
            体验剩余 {trialDaysLeft} 天
          </div>
        )}
      </div>

      {/* Pro Banner (Hide if already Pro) */}
      {!isPro && (
        <Card
          className="border-0 shadow-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden relative cursor-pointer active:scale-[0.99] transition-transform"
          onClick={() => router.push("/profile/pro")}
        >
          <CardContent className="p-4 flex items-center justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-sm text-yellow-100">
                  升级 FlowMoney Pro
                </span>
              </div>
              <p className="text-[10px] text-gray-300">
                解锁无限统计、多账本、去广告
              </p>
            </div>
            <Button
              size="sm"
              className="h-8 bg-yellow-400 text-black hover:bg-yellow-500 text-xs font-bold rounded-full pointer-events-none"
            >
              立即升级
            </Button>
          </CardContent>
          {/* Background Decoration */}
          <div className="absolute -right-6 -top-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
        </Card>
      )}

      {/* Settings List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-gray-500 px-2">Pro 会员专区</h2>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0 divide-y divide-gray-50">
            {featureItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleFeatureClick(item)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center relative",
                      theme.lightBg,
                      theme.text
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.proOnly && isPro && (
                      <Crown className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500 absolute -top-0.5 -right-0.5" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-xs">{item.value}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold text-gray-500 px-2">账号</h2>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0 divide-y divide-gray-50">
            <div
              className="flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => router.push("/profile/settings")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  通用设置
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            <div
              className="flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => router.push("/profile/contact")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-green-600">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  联系作者
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            <div
              className="flex items-center justify-between p-4 active:bg-red-50 transition-colors cursor-pointer group"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-red-500">
                  退出登录
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-[10px] text-gray-300 pt-4">
        v1.0.0 · Made with ❤️ by FlowMoney
      </div>
    </div>
  );
}
