"use client";

import { Bot } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Fitur</SidebarGroupLabel>
      <SidebarMenu>
        <Link
          href={"/seller/dashboard/order"}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
        >
          <Bot className="w-6 h-6" />
          Order
        </Link>
      </SidebarMenu>
    </SidebarGroup>
  );
}
