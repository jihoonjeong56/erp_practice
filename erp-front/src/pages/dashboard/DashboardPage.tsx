import { useEffect, useState } from "react";
import type { DashboardStats } from "../../types/dashboard";
import { useAuthStore } from "../../store/authStore";
import { getDashboardStats } from "../../api/dashboard.api";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { name } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const cards = stats
    ? [
        {
          label: "전체직원",
          value: `${stats.totalEmployees}명`,
          sub: `재직중 ${stats.activeEmployees}명`,
          color: "bg-indigo-500",
          textColor: "text-indigo-600",
          bgLight: "bg-indigo-50",
        },
        {
          label: "휴직 직원",
          value: `${stats.leaveEmployees}명`,
          sub: `퇴직 ${stats.resignedEmployees}명`,
          color: "bg-yellow-500",
          textColor: "text-yellow-600",
          bgLight: "bg-indigo-50",
        },
        {
          label: "부서수",
          value: `${stats.totalDepartments}개`,
          sub: "사용 중인 부서",
          color: "bg-teal-500",
          textColor: "text-teal-600",
          bgLight: "bg-teal-50",
        },
        {
          label: "직급 수",
          value: `${stats.totalPositions}개`,
          sub: "사용 중인 직급",
          color: "bg-rose-500",
          textColor: "text-rose-600",
          bgLight: "bg-rose-50",
        },
      ]
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          안녕하세요, {name}님
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          ERP 시스템 현황을 확인하세요.
        </p>
      </div>

      {/* KPI 카드 */}
      <div className="graid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3" />
                <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            ))
          : cards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-10 h-10 ${card.color} rounded-lg mb-3 flex items-center justify-center`}
                >
                  <div className="w-5 h-5 bg-white/30 rounde" />
                </div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.textColor}`}>
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </div>
            ))}
      </div>

      {/* 직원상태 요약 */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            직원 현황 요약
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "재직중",
                count: stats.activeEmployees,
                total: stats.totalEmployees,
                color: "bg-indigo-500",
              },
              {
                label: "휴직",
                count: stats.leaveEmployees,
                total: stats.totalEmployees,
                color: "bg-yellow-400",
              },
              {
                label: "재직중",
                count: stats.resignedEmployees,
                total: stats.totalEmployees,
                color: "bg-gray-300",
              },
            ].map((item) => {
              const pct =
                stats.totalEmployees > 0
                  ? Math.round((item.count / stats.totalEmployees) * 100)
                  : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="text-gray-800 font-medium">
                      {item.count} 명 ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gary-100 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
