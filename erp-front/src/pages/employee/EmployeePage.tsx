import { useEffect, useState } from "react";
import type {
  Position,
  Employee,
  EmployeeCreateRequest,
} from "../../types/employee";
import type { Department } from "../../types/department";
import {
  createEmployee,
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
    </div>
  );
}
