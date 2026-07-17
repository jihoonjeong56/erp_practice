import React, { useEffect, useState } from "react";
import type {
  Department,
  DepartmentCreateRequest,
} from "../../types/department";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "../../api/department.api";

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | null>(null);
  const [error, setError] = useState("");

  const initialForm = {
    deptCode: "",
    deptName: "",
    description: "",
    sortOrder: 0,
    parentId: null as number | null,
    useYn: "Y",
  };
  const [form, setForm] = useState(initialForm);

  // 조회
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch {
      setError("부서목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(initialForm);
    setShowModel(true);
  };

  const openEdit = (dept: Department) => {
    setEditTarget(dept);
    setForm({
      deptCode: dept.deptCode,
      deptName: dept.deptName,
      description: dept.description ?? "",
      sortOrder: dept.sortOrder,
      parentId: dept.parentId,
      useYn: dept.useYn,
    });
    setShowModel(true);
  };

  // 저장
  const handleSubmit = async () => {
    setError("");
    try {
      if (editTarget) {
        await updateDepartment(editTarget.id, {
          deptName: form.deptName,
          description: form.description,
          sortOrder: form.sortOrder,
          useYn: form.useYn,
          parentId: form.parentId,
        });
      } else {
        await createDepartment({
          deptCode: form.deptCode,
          deptName: form.deptName,
          description: form.description,
          sortOrder: form.sortOrder,
          parentId: form.parentId,
        } as DepartmentCreateRequest);
      }
      setShowModel(false);
      fetchDepartments();
    } catch (err: any) {
      setError(err.response?.data?.message || "저장에 실패했습니다.");
    }
  };

  // 삭제
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch (err: any) {
      alert(err.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">부서관리</h1>
        <button
          onClick={openCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg
        text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          +부서등록
        </button>
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
                "부서코드",
                "부서명",
                "상위부서",
                "정렬순서",
                "사용여부",
                "관리",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  불러오는중...
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 texgt-gray-400">
                  등록된 부서가 없습니다.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* -------------------------~ing--------------------------- */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
