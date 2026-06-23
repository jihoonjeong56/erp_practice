import React from "react";
import {
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  HomeIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const menus = [
  { label: "대시보드", path: "/dashboard", icon: HomeIcon },
  { label: "직원 관리", path: "/employees", icon: UserIcon },
  { label: "부서 관리", path: "/departments", icon: BuildingOfficeIcon },
  { label: "재고 관리", path: "/inventory", icon: CubeIcon },
  { label: "발주 관리", path: "/orders", icon: ClipboardDocumentListIcon },
  { label: "생산 관리", path: "/production", icon: WrenchScrewdriverIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col">
      <div>Sidebar</div>
    </aside>
  );
}
