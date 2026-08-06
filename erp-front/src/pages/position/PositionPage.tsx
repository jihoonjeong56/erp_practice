import { useEffect, useState } from "react";
import type { Position } from "../../types/employee";
import { getPositions } from "../../api/employee.api";
import {
  createPosition,
  deletePosition,
  updatePosition,
} from "../../api/position.api";

export default function PositionPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Position | null>(null);
  const [error, setError] = useState("");

  const initialForm = { posCode: "", posName: "", level: 1, useYn: "Y" };
  const [form, setForm] = useState(initialForm);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      setPositions(await getPositions());
    } catch {
      setError("직급 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (pos: Position) => {
    setEditTarget(pos);
    setForm({
      posCode: pos.posCode,
      posName: pos.posName,
      level: pos.level,
      useYn: pos.useYn,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setError("");
    try {
      if (editTarget) {
        await updatePosition(editTarget.id, {
          posName: form.posName,
          level: form.level,
          useYn: form.useYn,
        });
      } else {
        await createPosition({
          posCode: form.posCode,
          posName: form.posName,
          level: form.level,
        });
      }
      setShowModal(false);
      fetchPositions();
    } catch (err: any) {
      setError(err.response?.data?.message || "저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deletePosition(id);
      fetchPositions();
    } catch (err: any) {
      alert(err.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">직급 관리</h1>
        <button
          onClick={openCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg
            text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 직급 등록
        </button>
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
              {["직급코드", "직급명", "레벨", "사용여부", "관리"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left-text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  불러오는 중...
                </td>
              </tr>
            ) : positions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  등록된 직급이 없습니다.
                </td>
              </tr>
            ) : (
              positions.map((pos) => (
                <tr
                  key={pos.id}
                  className={`transition-colors
                ${pos.useYn === "N" ? "opacity-50 bg-gray-50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3 font-mono text-indigo-600">
                    {pos.posCode}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium 
                    ${
                      pos.useYn === "N"
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {pos.posName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">Lv.{pos.level}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 px-0.5 rounded-full text-xs font-medium 
                        ${
                          pos.useYn === "Y"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {pos.useYn === "Y" ? "사용" : "미사용"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(pos)}
                        className="texgt-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(pos.id)}
                        className="texgt-xs text-red-500 hover:text-red-700 font-medium"
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
    </div>
  );
}
