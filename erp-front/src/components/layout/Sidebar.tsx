import {
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  HomeIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

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
      {/* 로고 */}
      <div className="h-16 flex items-center justify-center border-d border-gray-700">
        <span className="text-x1 font-bold text-indigo-400">ERP System</span>
      </div>
      {/* 메뉴 */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
          ${
            isActive
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`
            }
          >
            <menu.icon className="w-5 h-5" />
            {menu.label}
          </NavLink>
        ))}
      </nav>
      {/* 하단 버전 */}
      <div className="p-4">v1.0.0</div>
    </aside>
  );
}
