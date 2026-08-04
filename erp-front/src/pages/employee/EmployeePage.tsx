import { useEffect, useState } from "react";
import type {
  Position,
  Employee,
  EmployeeCreateRequest,
} from "../../types/employee";
import type { Department } from "../../types/department";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  getPositions,
  updateEmployee,
} from "../../api/employee.api";
import { getDepartments } from "../../api/department.api";

const STAUS_LABEL: Record<string, { label: string; style: string }> = {
  ACTIVE: { label: "재직중", style: "bg-green-100 text-green-700" },
  LEAVE: { label: "휴직", style: "bg-yellow-100 text-yellow-700" },
  RESIGNED: { label: "퇴직", style: "bg-red-100 text-red-700" },
};
export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");

  const initialForm = {
    empNo: "",
    empName: "",
    email: "",
    phone: "",
    deptId: 0,
    positionId: 0,
    hireDate: "",
    status: "ACTIVE",
    leaveDate: "",
  };
  const [form, setForm] = useState(initialForm);
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [empData, deptData, posData] = await Promise.all([
        getEmployees(),
        getDepartments(),
        getPositions(),
      ]);
      setEmployees(empData);
      setDepartments(deptData);
      setPositions(posData);
    } catch {
      setError("데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);

  // 필터링
  const filtered = employees.filter((e) => {
    const matchStatus = filterStatus === "ALL" || e.status === filterStatus;
    const matchSearch =
      !searchKeyword ||
      e.empName.includes(searchKeyword) ||
      e.empNo.includes(searchKeyword) ||
      e.deptName.includes(searchKeyword);
    return matchStatus && matchSearch;
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditTarget(emp);
    setForm({
      empNo: emp.empNo,
      empName: emp.empName,
      email: emp.email,
      phone: emp.phone ?? "",
      deptId: emp.deptId,
      positionId: emp.positionId,
      hireDate: emp.hireDate?.slice(0, 10) ?? "",
      status: emp.status,
      leaveDate: emp.leaveDate?.slice(0, 10) ?? "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setError("");
    try {
      if (editTarget) {
        await updateEmployee(editTarget.id, {
          empName: form.empName,
          email: form.email,
          phone: form.phone,
          deptId: form.deptId,
          positionId: form.positionId,
          status: form.status,
          leaveDate: form.leaveDate || null,
        });
      } else {
        await createEmployee({
          empNo: form.empNo,
          empName: form.empName,
          email: form.email,
          phone: form.phone,
          deptId: Number(form.deptId),
          positionId: Number(form.positionId),
          hireDate: form.hireDate,
        } as EmployeeCreateRequest);
      }
      setShowModal(false);
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || "저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteEmployee(id);
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">직원관리</h1>
        <button
          onClick={openCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg
        text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 직원 등록
        </button>
      </div>
      {/* 검색 / 필터 */}
      <div className="flex gap-3 mb-4">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm
        w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="이름, 사번, 부서 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        {["ALL", "ACTIVE", "LEAVE", "RESIGNED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${filterStatus === s ? "bg-indigo-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            {s === "ALL" ? "전체" : STAUS_LABEL[s]?.label}
          </button>
        ))}
      </div>

      {/* 에러 */}
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
              {[
                "사번",
                "이름",
                "부서",
                "직급",
                "이메일",
                "입사일",
                "상태",
                "관리",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold
                text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400">
                  불러오는 중...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400">
                  직원이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr
                  key={emp.id}
                  className={`transition-colors ${emp.status === "RESIGNED" ? "opacity-50 bg-gray-50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3 font-mono text-indigo-600 text-xs">
                    {emp.empNo}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${emp.status === "RESIGNED" ? "text-gray-400 line-through" : "text-gray-800"}`}
                  >
                    {emp.empName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{emp.deptName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {emp.positionName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{emp.email}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {emp.hireDate?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${STAUS_LABEL[emp.status]?.style}`}
                    >
                      {STAUS_LABEL[emp.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="text-xs text-indigo-600 hover: text-indigo-800 font-medium"
                        onClick={() => openEdit(emp)}
                      >
                        수정
                      </button>
                      <button
                        className="text-xs text-indigo-500 hover: text-indigo-700 font-medium"
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

        {/* 하단 통계 */}
      </div>
    </div>
  );
}
