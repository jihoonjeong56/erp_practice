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
  const [showModal, setShowModal] = useState(false);
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
    setShowModal(true);
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
    setShowModal(true);
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
      setShowModal(false);
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
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    {dept.deptCode}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {dept.deptName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {dept.parentName ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{dept.sortOrder}</td>
                  <td className="px-4 py-3 text-gray500">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${dept.useYn === "Y" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {dept.useYn === "Y" ? "사용" : "미사용"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(dept)}
                        className="text-xw text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
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
      </div>

      {/* 등록/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text=lg font-bold text-gray-800 mb-4">
              {editTarget ? "부서 수정" : "부서 등록"}
            </h2>

            <div className="space-y-3">
              {/* 부서 코드 - 등록시 */}
              {!editTarget && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    부서코드
                    <span>*</span>
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus: ring-indigo-500"
                    placeholder="예: DEV"
                    value={form.deptCode}
                    onChange={(e) =>
                      setForm({ ...form, deptCode: e.target.value })
                    }
                  />
                </div>
              )}

              {/* 부서명 */}
              <div>
                <label className="block text-sm font-medium text-gray mb-1">
                  부서명<span>*</span>
                </label>
                <input
                  className=" w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="부서명 입력"
                  value={form.deptName}
                  onChange={(e) =>
                    setForm({ ...form, deptName: e.target.value })
                  }
                />
              </div>
              {/* 상위 부서 */}
              <div>
                <label className="block text-sm font-medium text-gray mb-1">
                  상위부서
                </label>
                <select
                  className=" w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.parentId ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      parentId: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">최상위 부서</option>
                  {departments
                    .filter((d) => !editTarget || d.id !== editTarget.id)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.deptName}
                      </option>
                    ))}
                </select>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="부서 설명 (선택)"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* 정렬순서 */}
              <div>
                <label className="block test-sm font-medium text-gray-700 mb-1">
                  정렬순서
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 
                text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sortOrder: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* 사용여부 - 수정 시에만 */}
              {editTarget && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사용여부
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-lg px-3 py-2
                  text-sm focus:outlink-none focus:ring-2 focus:ring-indigo-500"
                    value={form.useYn}
                    onChange={(e) =>
                      setForm({ ...form, useYn: e.target.value })
                    }
                  >
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                  </select>
                </div>
              )}
            </div>

            {/* 에러 */}
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            {/* 버튼 */}
            <div className="fext justigy-eng gap-2 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 
                rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm text-white bg-indigo-600 
              rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editTarget ? "수정" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
