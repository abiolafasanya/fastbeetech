// app/(admin)/admin/layout.tsx
"use client";

import clsx from "clsx";
import { useSidebarCollapsed } from "@/store/dashboardUI";
import Sidebar from "./components/Sidebar";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const SIDEBAR_W = 256; // w-64
const SIDEBAR_W_COLLAPSED = 72; // w-[72px]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthRedirect(); // Redirect to login if not authenticated

  const collapsed = useSidebarCollapsed();
  const leftPad = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;

  return (
    <div className="min-h-screen">
      {/* offset below public header (h-14) and reserve space for sidebar */}
      <div
        className={clsx("transition-[padding] duration-200")}
        style={{ paddingLeft: leftPad }}
      >
        <div className="px-5 py-3.5 border-b flex items-center justify-between bg-background/80 backdrop-blur">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="p-5 overflow-x-auto">{children}</div>
      </div>

      <Sidebar />
    </div>
  );
}
