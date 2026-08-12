import { useEffect, useState } from "react";
import type { CodeGroup, CommonCode } from "../../types/code";
import {
  createCodeGroup,
  createCommonCode,
  deleteCommonCode,
  getCodeGroups,
  getCommonCode,
  updateCodeGroup,
  updateCommonCode,
} from "../../api/code.api";

export default function CodePage() {
  const [groups, setGroups] = useState<CodeGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<CodeGroup | null>(null);
  const [codes, setCodes] = useState<CommonCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //   그룹
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editGroup, setEditGroup] = useState<CodeGroup | null>(null);
  const initialGroupForm = { groupCode: "", groupName: "", description: "" };
  const [groupForm, setGroupForm] = useState(initialGroupForm);

  //   코드
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [editCode, setEditCode] = useState<CommonCode | null>(null);
  const initialCodeForm = { code: "", codeName: "", sortOrder: 0, useYn: "Y" };
  const [codeForm, setCodeForm] = useState(initialCodeForm);

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

  const fetchCodes = async (groupCode: string) => {
    try {
      setCodes(await getCommonCode(groupCode));
    } catch {
      setError("코드 목록을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSelectGroup = (group: CodeGroup) => {
    setSelectedGroup(group);
    fetchCodes(group.groupCode);
  };

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
      <div>
        <h1 className="flex item-center justify-between mb-6">
          공통 코드 관리
        </h1>
        <button
          onClick={() => {
            setEditGroup(null);
            setGroupForm(initialGroupForm);
            setShowGroupModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 코드 그룹 등록
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        {/* 왼쪽 - 코드 그룹 목록 */}
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex shrink-0">
          <div className="px -4 py-3 bg-gray-50 border-b border-gray-100">
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
                    className={`w-full text-left px-4 py-3 text-sm transition-colors
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
                    className="px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    + 코드 추가
                  </button>
                </div>
              </div>

              <div>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                    </tr>
                  </thead>
                </table>
              </div>
            </>
          ) : (
            <div
              className="flex items-center justify-center h-48
            text-gray-400 text-sm"
            >
              왼쪽에서 코드 그룹을 선택해 주세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
