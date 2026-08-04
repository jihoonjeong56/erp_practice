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

  return <div>EmployeePage</div>;
}
