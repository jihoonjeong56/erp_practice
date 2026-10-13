import { useEffect, useState } from "react";
import  {
  getCodeGroups,
  createCodeGroup,
  updateCodeGroup,
  getCommonCodes,
  createCommonCode,
  updateCommonCode,
  deleteCommonCode,
} from "../../api/code.api";
import type { CodeGroup, CommonCode } from "../../types/code";

export default function CodePage() {
  const [groups, setGroups] = useState<CodeGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<CodeGroup | null>(null);
  const [codes, setCodes] = useState<CommonCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 그룹 모달
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editGroup, setEditGroup] = useState<CodeGroup | null>(null);
  const initialGroupForm = { groupCode: "", groupName: "", description: "" };
  const [groupForm, setGroupForm] = useState(initialGroupForm);

  // 코드 모달
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [editCode, setEditCode] = useState<CommonCode | null>(null);
  const initialCodeForm = { code: "", codeName: "", sortOrder: 0, useYn: "Y" };
  const [codeForm, setCodeForm] = useState(initialCodeForm);

  // 그룹 목록 조회
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await getCodeGroups();
      setGroups(data);
      if (data.length > 0 && !selectedGroup) {
        setSelectedGroup(data[0]);
        fetchCodes(data[0].groupCode);
      }
    } catch {
      setError("코드 그룹을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 코드 목록 조회
  const fetchCodes = async (groupCode: string) => {
    try {
      setCodes(await getCommonCodes(groupCode));
    } catch {
      setError("코드 목록을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // 그룹 선택
  const handleSelectGroup = (group: CodeGroup) => {
    setSelectedGroup(group);
    fetchCodes(group.groupCode);
  };

  // 그룹 저장
  const handleGroupSubmit = async () => {
    setError("");
    try {
      if (editGroup) {
        await updateCodeGroup(editGroup.groupCode, {
          groupName: groupForm.groupName,
          description: groupForm.description,
        });
      } else {
        await createCodeGroup({
          groupCode: groupForm.groupCode,
          groupName: groupForm.groupName,
          description: groupForm.description,
        });
      }
      setShowGroupModal(false);
      fetchGroups();
    } catch (err: any) {
      setError(err.response?.data?.message || "저장에 실패했습니다.");
    }
  };

  // 코드 저장
  const handleCodeSubmit = async () => {
    if (!selectedGroup) return;
    setError("");
    try {
      if (editCode) {
        await updateCommonCode(selectedGroup.groupCode, editCode.id, {
          codeName: codeForm.codeName,
          sortOrder: codeForm.sortOrder,
          useYn: codeForm.useYn,
        });
      } else {
        await createCommonCode(selectedGroup.groupCode, {
          code: codeForm.code,
          codeName: codeForm.codeName,
          sortOrder: codeForm.sortOrder,
        });
      }
      setShowCodeModal(false);
      fetchCodes(selectedGroup.groupCode);
    } catch (err: any) {
      setError(err.response?.data?.message || "저장에 실패했습니다.");
    }
  };

  // 코드 삭제
  const handleDeleteCode = async (codeId: number) => {
    if (!selectedGroup) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteCommonCode(selectedGroup.groupCode, codeId);
      fetchCodes(selectedGroup.groupCode);
    } catch (err: any) {
      alert(err.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">공통 코드 관리</h1>
        <button
          onClick={() => {
            setEditGroup(null);
            setGroupForm(initialGroupForm);
            setShowGroupModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg
            text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 코드 그룹 등록
        </button>
      </div>

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 text-red-600 text-sm
          rounded-lg border border-red-200"
        >
          {error}
        </div>
      )}

      <div className="flex gap-4">
        {/* 왼쪽 - 코드 그룹 목록 */}
        <div
          className="w-64 bg-white rounded-xl shadow-sm
          border border-gray-100 overflow-hidden flex-shrink-0"
        >
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase">
              코드 그룹
            </p>
          </div>
          <ul className="divide-y divide-gray-50">
            {loading ? (
              <li className="px-4 py-3 text-sm text-gray-400">
                불러오는 중...
              </li>
            ) : groups.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400">
                등록된 그룹이 없습니다.
              </li>
            ) : (
              groups.map((group) => (
                <li key={group.groupCode}>
                  <button
                    onClick={() => handleSelectGroup(group)}
                    className={`w-full text-left px-4 py-3 text-sm
                      transition-colors
                      ${
                        selectedGroup?.groupCode === group.groupCode
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <p className="font-medium">{group.groupName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {group.groupCode}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* 오른쪽 - 코드 값 목록 */}
        <div className="flex-1">
          {selectedGroup ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    {selectedGroup.groupName}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {selectedGroup.groupCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditGroup(selectedGroup);
                      setGroupForm({
                        groupCode: selectedGroup.groupCode,
                        groupName: selectedGroup.groupName,
                        description: selectedGroup.description ?? "",
                      });
                      setShowGroupModal(true);
                    }}
                    className="px-3 py-1.5 text-xs text-gray-600
                      border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    그룹 수정
                  </button>
                  <button
                    onClick={() => {
                      setEditCode(null);
                      setCodeForm(initialCodeForm);
                      setShowCodeModal(true);
                    }}
                    className="px-3 py-1.5 text-xs text-white
                      bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    + 코드 추가
                  </button>
                </div>
              </div>

              <div
                className="bg-white rounded-xl shadow-sm
                border border-gray-100 overflow-hidden"
              >
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["코드", "코드명", "정렬순서", "사용여부", "관리"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-semibold
                            text-gray-500 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {codes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-400"
                        >
                          등록된 코드가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      codes.map((code) => (
                        <tr
                          key={code.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-indigo-600">
                            {code.code}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {code.codeName}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {code.sortOrder}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full
                              text-xs font-medium
                              ${
                                code.useYn === "Y"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {code.useYn === "Y" ? "사용" : "미사용"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditCode(code);
                                  setCodeForm({
                                    code: code.code,
                                    codeName: code.codeName,
                                    sortOrder: code.sortOrder,
                                    useYn: code.useYn,
                                  });
                                  setShowCodeModal(true);
                                }}
                                className="text-xs text-indigo-600
                                  hover:text-indigo-800 font-medium"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDeleteCode(code.id)}
                                className="text-xs text-red-500
                                  hover:text-red-700 font-medium"
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
            </>
          ) : (
            <div
              className="flex items-center justify-center h-48
              text-gray-400 text-sm"
            >
              왼쪽에서 코드 그룹을 선택해주세요.
            </div>
          )}
        </div>
      </div>

      {/* 코드 그룹 모달 */}
      {showGroupModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center
          justify-center z-50"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editGroup ? "코드 그룹 수정" : "코드 그룹 등록"}
            </h2>
            <div className="space-y-3">
              {!editGroup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    그룹 코드 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                      text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="예: EMPLOYEE_STATUS"
                    value={groupForm.groupCode}
                    onChange={(e) =>
                      setGroupForm({
                        ...groupForm,
                        groupCode: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  그룹명 <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="예: 직원 상태"
                  value={groupForm.groupName}
                  onChange={(e) =>
                    setGroupForm({
                      ...groupForm,
                      groupName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="설명 (선택)"
                  value={groupForm.description}
                  onChange={(e) =>
                    setGroupForm({
                      ...groupForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  setError("");
                }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300
                  rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleGroupSubmit}
                className="px-4 py-2 text-sm text-white bg-indigo-600
                  rounded-lg hover:bg-indigo-700"
              >
                {editGroup ? "수정" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 코드 값 모달 */}
      {showCodeModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center
          justify-center z-50"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editCode ? "코드 수정" : "코드 추가"}
            </h2>
            <div className="space-y-3">
              {!editCode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    코드 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                      text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="예: ACTIVE"
                    value={codeForm.code}
                    onChange={(e) =>
                      setCodeForm({
                        ...codeForm,
                        code: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  코드명 <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="예: 재직중"
                  value={codeForm.codeName}
                  onChange={(e) =>
                    setCodeForm({
                      ...codeForm,
                      codeName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  정렬순서
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={codeForm.sortOrder}
                  onChange={(e) =>
                    setCodeForm({
                      ...codeForm,
                      sortOrder: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* 사용여부 - 수정 시에만 */}
              {editCode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사용여부
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                      text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={codeForm.useYn}
                    onChange={(e) =>
                      setCodeForm({
                        ...codeForm,
                        useYn: e.target.value,
                      })
                    }
                  >
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                  </select>
                </div>
              )}
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowCodeModal(false);
                  setError("");
                }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300
                  rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleCodeSubmit}
                className="px-4 py-2 text-sm text-white bg-indigo-600
                  rounded-lg hover:bg-indigo-700"
              >
                {editCode ? "수정" : "추가"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
