import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const navigate = useNavigate();
  const { name, role, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* 왼쪽 - 페이지 타이틀 영역 */}
      <div className="text-gray-500 text-sm">제조업 ERP 관리 시스템</div>
      {/* 오른쪽 - 유저 정보 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserCircleIcon className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-gray-800">{name}</span>
          <span
            className="text-xs bg-indigo-100 text-indigo-600
                px-2 py-0.5 rounded-full"
          >
            {role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500
            hover:text-red-500 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          로그아웃
        </button>
      </div>
    </header>
  );
}
