// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import {
  Home,
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Briefcase,
} from "lucide-react";
import clsx from "clsx";
import { useSidebarCollapsed, useToggleSidebar } from "@/store/dashboardUI";

export default function Sidebar() {
  const collapsed = useSidebarCollapsed();
  const toggle = useToggleSidebar();

  return (
    <aside
      className={clsx(
        "fixed left-0 top-[85px] z-30 h-[calc(100vh-3.5rem)] border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-14 px-3 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5" />
          {!collapsed && <span className="font-semibold">Dashboard</span>}
        </Link>
        <button
          aria-label="Toggle sidebar"
          onClick={toggle}
          className="p-1 rounded hover:bg-muted"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="px-2 py-3">
        <NavItem
          href="/dashboard"
          icon={<Home className="w-4 h-4" />}
          label="Overview"
          collapsed={collapsed}
        />
        {!collapsed && <SectionTitle>Content</SectionTitle>}
        <NavItem
          href="/dashboard/blog"
          icon={<FileText className="w-4 h-4" />}
          label="Blog"
          collapsed={collapsed}
        />
        <NavItem
          href="/dashboard/internship"
          icon={<Briefcase className="w-4 h-4" />}
          label="Internship"
          collapsed={collapsed}
        />
        <NavItem
          href="/dashboard/comments"
          icon={<MessageSquare className="w-4 h-4" />}
          label="Comments"
          collapsed={collapsed}
        />
        {!collapsed && <SectionTitle>Settings</SectionTitle>}
        <NavItem
          href="/dashboard/settings"
          icon={<Settings className="w-4 h-4" />}
          label="Settings"
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-2 py-2 rounded hover:bg-muted text-sm"
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pt-4 pb-2 text-xs uppercase text-muted-foreground">
      {children}
    </div>
  );
}
