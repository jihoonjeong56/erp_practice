import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboard.api";
import { getDepartments } from "../../api/department.api";
import {
  deleteEmployee,
  getPositions,
  searchEmployees,
} from "../../api/employee.api";
import Pagination from "../../components/common/Pagination";
import type { PageResponse } from "../../types/common";
import type { DashboardStats } from "../../types/dashboard";
import type { Department } from "../../types/department";
import type { Employee, Position } from "../../types/employee";
import { getErrorMessage } from "../../utils/getErrorMessage";
import EmployeeFormModal from "./EmployeeFormModal";

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<string, { label: string; style: string }> = {
  ACTIVE: { label: "재직중", style: "bg-green-100 text-green-700" },
  LEAVE: { label: "휴직", style: "bg-yellow-100 text-yellow-700" },
  RESIGNED: { label: "퇴직", style: "bg-red-100 text-red-700" },
};
const STATUS_FILTERS = ["ALL", "ACTIVE", "LEAVE", "RESIGNED"];

const selectClass =
  "border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function EmployeePage() {
  const [result, setResult] = useState<PageResponse<Employee> | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 검색 조건
  const [keywordInput, setKeywordInput] = useState(""); // 입력 중인 값
  const [keyword, setKeyword] = useState(""); // 검색 버튼/Enter로 확정된 값
  const [status, setStatus] = useState("ALL");
  const [deptId, setDeptId] = useState(0);
  const [positionId, setPositionId] = useState(0);
  const [page, setPage] = useState(0);

  // 등록/수정/삭제 후 목록을 다시 불러오기 위한 값
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  const [modal, setModal] = useState<{ employee: Employee | null } | null>(null);

  // 부서/직급 목록은 한 번만 조회
  useEffect(() => {
    Promise.all([getDepartments(), getPositions()])
      .then(([deptData, posData]) => {
        setDepartments(deptData);
        setPositions(posData);
      })
      .catch((err) =>
        setError(getErrorMessage(err, "부서/직급 목록을 불러오지 못했습니다.")),
      );
  }, []);

  // 검색 조건이 바뀔 때마다 서버에서 다시 조회
  useEffect(() => {
    let ignore = false; // 늦게 도착한 이전 응답이 화면을 덮어쓰지 않도록
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await searchEmployees({
          keyword: keyword || undefined,
          deptId: deptId || undefined,
          positionId: positionId || undefined,
          status: status === "ALL" ? undefined : status,
          page,
          size: PAGE_SIZE,
        });
        if (!ignore) setResult(data);
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err, "직원 목록을 불러오지 못했습니다."));
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [keyword, status, deptId, positionId, page, reloadKey]);

  // 하단 상태별 인원 수 (대시보드 통계 API 재사용)
  useEffect(() => {
    let ignore = false;
    getDashboardStats()
      .then((data) => {
        if (!ignore) setStats(data);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const applyKeyword = () => {
    setKeyword(keywordInput.trim());
    setPage(0);
  };

  const resetFilters = () => {
    setKeywordInput("");
    setKeyword("");
    setStatus("ALL");
    setDeptId(0);
    setPositionId(0);
    setPage(0);
  };

  const handleSaved = () => {
    setModal(null);
    reload();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteEmployee(id);
      // 마지막 페이지의 마지막 항목을 지웠다면 한 페이지 앞으로 이동
      if (result && result.content.length === 1 && page > 0) {
        setPage(page - 1);
      }
      reload();
    } catch (err) {
      alert(getErrorMessage(err, "삭제에 실패했습니다."));
    }
  };

  const employees = result?.content ?? [];

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">직원 관리</h1>
        <button
          onClick={() => setModal({ employee: null })}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 직원 등록
        </button>
      </div>

      {/* 검색 */}
      <div className="flex gap-2 mb-3">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="이름 또는 사번 검색"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyKeyword()}
        />
        <button
          onClick={applyKeyword}
          className="px-4 py-2 text-sm text-white bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
        >
          검색
        </button>
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          초기화
        </button>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-3 mb-4">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === s
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "ALL" ? "전체" : STATUS_LABEL[s].label}
          </button>
        ))}

        <select
          className={selectClass}
          value={deptId}
          onChange={(e) => {
            setDeptId(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value={0}>전체 부서</option>
          {departments
            .filter((d) => d.useYn === "Y")
            .map((d) => (
              <option key={d.id} value={d.id}>
                {d.parentName ? `${d.parentName} > ` : ""}
                {d.deptName}
              </option>
            ))}
        </select>

        <select
          className={selectClass}
          value={positionId}
          onChange={(e) => {
            setPositionId(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value={0}>전체 직급</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.posName}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["사번", "이름", "부서", "직급", "이메일", "입사일", "상태", "관리"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400">
                  불러오는 중...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400">
                  조건에 맞는 직원이 없습니다.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  className={`transition-colors ${
                    emp.status === "RESIGNED"
                      ? "opacity-50 bg-gray-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-indigo-600 text-xs">
                    {emp.empNo}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      emp.status === "RESIGNED"
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {emp.empName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{emp.deptName}</td>
                  <td className="px-4 py-3 text-gray-500">{emp.positionName}</td>
                  <td className="px-4 py-3 text-gray-500">{emp.email}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {emp.hireDate?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_LABEL[emp.status]?.style
                      }`}
                    >
                      {STATUS_LABEL[emp.status]?.label ?? emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        onClick={() => setModal({ employee: emp })}
                      >
                        수정
                      </button>
                      <button
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                        onClick={() => handleDelete(emp.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 하단 통계 (전체 직원 기준) */}
        {stats && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex gap-4 text-xs text-gray-500">
            <span>
              전체 <b className="text-gray-700">{stats.totalEmployees}</b>명
            </span>
            <span>
              재직중 <b className="text-green-600">{stats.activeEmployees}</b>명
            </span>
            <span>
              휴직 <b className="text-yellow-600">{stats.leaveEmployees}</b>명
            </span>
            <span>
              퇴직 <b className="text-gray-400">{stats.resignedEmployees}</b>명
            </span>
          </div>
        )}
      </div>

      {/* 검색 결과 / 페이지 이동 */}
      {result && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            검색 결과 <b className="text-gray-700">{result.totalElement}</b>명
            {result.totalPages > 0 && (
              <span className="ml-2 text-gray-400">
                {result.page + 1} / {result.totalPages} 페이지
              </span>
            )}
          </p>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            onChange={setPage}
          />
        </div>
      )}

      {modal && (
        <EmployeeFormModal
          employee={modal.employee}
          departments={departments}
          positions={positions}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}