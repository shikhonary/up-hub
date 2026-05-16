"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Calculator, ChevronDown } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  FileText,
  CalendarDays,
  Calendar,
  BarChart3,
  Bell,
  Megaphone,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  ClipboardList,
  TrendingUp,
  BookOpen,
  FileSpreadsheet,
  FileEdit,
  Shield,
  Briefcase,
  DollarSign,
  CreditCard,
  SendHorizonal,
  BookCopy,
  Bus,
  Activity,
  Lock,
  Hash,
  Building2,
  MapPin,
  UserPlus,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { cn } from "@workspace/ui/lib/utils";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { title: string; url: string; icon?: React.ComponentType<{ className?: string }> }[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "মূল কার্যক্রম",
    items: [
      { title: "ড্যাশবোর্ড", url: "/", icon: LayoutDashboard },
      {
        title: "খানা জরিপ",
        url: "/household-dashboard",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "ভৌগোলিক তথ্য",
    items: [
      { title: "ওয়ার্ডসমূহ", url: "/wards", icon: MapPin },
      { title: "গ্রামসমূহ", url: "/villages", icon: Building2 },
    ],
  },
  {
    label: "নাগরিক সেবা",
    items: [
      {
        title: "নাগরিক ব্যবস্থাপনা",
        url: "/citizens",
        icon: Users,
        subItems: [
          { title: "নতুন আবেদন", url: "/citizens/applications/apply", icon: UserPlus },
          { title: "আবেদনসমূহ", url: "/citizens/applications", icon: FileEdit },
          { title: "নাগরিক তালিকা", url: "/citizens", icon: ClipboardList },
        ],
      },
      {
        title: "হোল্ডিং ট্যাক্স ব্যবস্থাপনা",
        url: "/holding-tax",
        icon: Building2,
        subItems: [
          { title: "ট্যাক্স ডাটা", url: "/holding-tax/records", icon: ClipboardList },
          {
            title: "খানা জরিপ ফর্ম",
            url: "/holding-tax/assessments/apply",
            icon: UserPlus,
          },
          {
            title: "খানা জরিপ তালিকা",
            url: "/holding-tax/assessments",
            icon: FileSpreadsheet,
          },
          {
            title: "ট্যাক্স জেনারেট",
            url: "/holding-tax/assessments/bulk-generate",
            icon: Calculator,
          },
          {
            title: "রিপোর্ট ও অ্যানালিটিক্স",
            url: "/holding-tax/analytics",
            icon: BarChart3,
          },
        ],
      },
      {
        title: "ট্রেড লাইসেন্স",
        url: "/trade-license",
        icon: Briefcase,
        subItems: [
          { title: "নতুন আবেদন", url: "/trade-license/applications/apply", icon: UserPlus },
          { title: "আবেদন তালিকা", url: "/trade-license/applications", icon: FileEdit },
          { title: "লাইসেন্স তালিকা", url: "/trade-license/list", icon: ClipboardList },
          { title: "লাইসেন্স ক্যাটাগরি", url: "/administrative/trade-license-categories", icon: Hash },
        ],
      },
      {
        title: "উত্তরাধিকার সনদ",
        url: "/succession",
        icon: GraduationCap,
        subItems: [
          { title: "নতুন আবেদন", url: "/succession/applications/apply", icon: UserPlus },
          { title: "আবেদন তালিকা", url: "/succession/applications", icon: FileEdit },
        ],
      },
      { title: "পারিবারিক তথ্য", url: "/family", icon: UserCheck },
      { title: "সনদপত্র", url: "/certificates", icon: FileText },
    ],
  },
  {
    label: "প্রশাসন",
    items: [
      { title: "জনবল ব্যবস্থাপনা", url: "/hr", icon: Briefcase },
      { title: "উপস্থিতি", url: "/attendance", icon: CalendarDays },
      { title: "রেজিস্টার খাতা", url: "/registers", icon: ClipboardList },
      { title: "দায়িত্ব বন্টন", url: "/duty-allocation", icon: Shield },
      { title: "অর্থবছর", url: "/administrative/fiscal-years", icon: Calendar },
    ],
  },
  {
    label: "ইউটিলিটি",
    items: [
      {
        title: "সনদপত্র কাউন্টার",
        url: "/administrative/certificate-counters",
        icon: Hash,
      },
    ],
  },
  {
    label: "অর্থ ও বাজেট",
    items: [
      { title: "হিসাব রক্ষণ", url: "/accounts", icon: DollarSign },
      { title: "পেমেন্ট", url: "/payments", icon: CreditCard },
    ],
  },
  {
    label: "সিস্টেম",
    items: [
      { title: "অভিযোগ", url: "/complaints", icon: Megaphone },
      { title: "নোটিশবোর্ড", url: "/announcements", icon: Bell },
      { title: "সেটিংস", url: "/settings", icon: Settings },
    ],
  },
];

interface SidebarContentProps {
  collapsed: boolean;
  onToggle?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  collapsed,
  onToggle,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = { email: "admin@tenant.com" }; // Placeholder logic, should be replaced with actual auth session data if available

  const handleLogout = async () => {
    // In a real app, you might want to call an API to sign out
    router.push("/auth");
  };

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/" || pathname === "/admin";
    }
    return pathname.startsWith(url);
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-glow">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-foreground">
                Shikhonary
              </span>
              <span className="text-xs text-muted-foreground -mt-0.5 font-bold">
                ইউনিয়ন পরিষদ পোর্টাল
              </span>
            </div>
          )}
        </Link>
        {onToggle && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isSectionActive = isActive(item.url);

                  if (hasSubItems && !collapsed) {
                    return (
                      <Accordion
                        key={item.title}
                        type="single"
                        collapsible
                        defaultValue={isSectionActive ? item.title : undefined}
                      >
                        <AccordionItem value={item.title} className="border-none">
                          <AccordionTrigger
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors hover:no-underline",
                              isSectionActive
                                ? "bg-primary/5 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 flex-shrink-0" />
                              <span>{item.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-1 pt-1 ml-4 border-l border-border/50">
                            <div className="pl-4 space-y-1 mt-1">
                              {item.subItems?.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.url}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                                    pathname === subItem.url
                                      ? "text-primary bg-primary/10"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                  )}
                                >
                                  {subItem.icon && <subItem.icon className="w-3.5 h-3.5" />}
                                  <span>{subItem.title}</span>
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  }

                  const linkContent = (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors",
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        collapsed && "justify-center",
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.title}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" className="font-bold text-xs">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkContent;
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                ইউপি
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-foreground truncate">
                ইউপি অ্যাডমিন
              </p>
              <p className="text-[10px] text-muted-foreground truncate font-bold">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>লগ আউট</span>}
        </button>
      </div>
    </div>
  );
};

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed,
  onToggle,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-none">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute top-4 -right-3 w-6 h-6 rounded-full bg-card border border-border shadow-sm z-40"
        >
          <ChevronLeft className="w-3 h-3 rotate-180" />
        </Button>
      )}
    </aside>
  );
};
