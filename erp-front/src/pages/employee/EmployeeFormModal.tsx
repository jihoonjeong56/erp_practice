import { useState } from "react";
import { createEmployee, updateEmployee } from "../../api/employee.api";
import type { Department } from "../../types/department";
import type { Employee, Position } from "../../types/employee";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface Props {
  employee: Employee | null; // null이면 등록, 값이 있으면 수정
  departments: Department[];
  positions: Position[];
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

// 백엔드가 LocalDateTime을 받으므로 날짜(yyyy-MM-dd)에 시간을 붙여 보낸다
const toDateTime = (date: string) => `${date}T00:00:00`;

export default function EmployeeFormModal({
  employee,
  departments,
  positions,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState({
    empNo: employee?.empNo ?? "",
    empName: employee?.empName ?? "",
    email: employee?.email ?? "",
    phone: employee?.phone ?? "",
    deptId: employee?.deptId ?? 0,
    positionId: employee?.positionId ?? 0,
    hireDate: employee?.hireDate?.slice(0, 10) ?? "",
    status: employee?.status ?? "ACTIVE",
    leaveDate: employee?.leaveDate?.slice(0, 10) ?? "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.deptId || !form.positionId) {
      setError("부서와 직급을 선택해 주세요.");
      return;
    }
    if (!employee && !form.hireDate) {
      setError("입사일을 입력해 주세요.");
      return;
    }

    try {
      if (employee) {
        await updateEmployee(employee.id, {
          empName: form.empName,
          email: form.email,
          phone: form.phone,
          deptId: form.deptId,
          positionId: form.positionId,
          status: form.status,
          // 퇴직 상태가 아니면 퇴직일을 비운다
          leaveDate:
            form.status === "RESIGNED" && form.leaveDate
              ? toDateTime(form.leaveDate)
              : null,
        });
      } else {
        await createEmployee({
          empNo: form.empNo,
          empName: form.empName,
          email: form.email,
          phone: form.phone,
          deptId: form.deptId,
          positionId: form.positionId,
          hireDate: toDateTime(form.hireDate),
        });
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err, "저장에 실패했습니다."));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {employee ? "직원 수정" : "직원 등록"}
        </h2>

        <div className="space-y-3">
          {/* 사번 - 등록 시에만 */}
          {!employee && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사번 <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="예: EMP2024001"
                value={form.empNo}
                onChange={(e) => setForm({ ...form, empNo: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="직원명 입력"
              value={form.empName}
              onChange={(e) => setForm({ ...form, empName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder="이메일 입력"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처
            </label>
            <input
              className={inputClass}
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              부서 <span className="text-red-500">*</span>
            </label>
            <select
              className={inputClass}
              value={form.deptId}
              onChange={(e) =>
                setForm({ ...form, deptId: Number(e.target.value) })
              }
            >
              <option value={0}>부서 선택</option>
              {departments
                .filter((d) => d.useYn === "Y")
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.parentName ? `${d.parentName} > ` : ""}
                    {d.deptName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              직급 <span className="text-red-500">*</span>
            </label>
            <select
              className={inputClass}
              value={form.positionId}
              onChange={(e) =>
                setForm({ ...form, positionId: Number(e.target.value) })
              }
            >
              <option value={0}>직급 선택</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.posName}
                </option>
              ))}
            </select>
          </div>

          {/* 입사일 - 등록 시에만 */}
          {!employee && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                입사일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={inputClass}
                value={form.hireDate}
                onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
              />
            </div>
          )}

          {/* 상태 / 퇴직일 - 수정 시에만 */}
          {employee && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상태 <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="ACTIVE">재직중</option>
                  <option value="LEAVE">휴직</option>
                  <option value="RESIGNED">퇴직</option>
                </select>
              </div>

              {form.status === "RESIGNED" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    퇴직일
                  </label>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.leaveDate}
                    onChange={(e) =>
                      setForm({ ...form, leaveDate: e.target.value })
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {employee ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
