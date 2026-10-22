import { useState } from "react";
import { createItem, updateItem } from "../../api/inventory.api";
import type { CommonCode } from "../../types/code";
import type { Item } from "../../types/inventory";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface Props {
  item: Item | null; // null이면 등록, 값이 있으면 수정
  units: CommonCode[];
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function ItemFormModal({
  item,
  units,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState({
    itemCode: item?.itemCode ?? "",
    itemName: item?.itemName ?? "",
    unit: item?.unit ?? units[0]?.code ?? "",
    safetyStock: item?.safetyStock ?? 0,
    useYn: item?.useYn ?? "Y",
  });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (item) {
        await updateItem(item.id, {
          itemName: form.itemName,
          unit: form.unit,
          safetyStock: form.safetyStock,
          useYn: form.useYn,
        });
      } else {
        await createItem({
          itemCode: form.itemCode,
          itemName: form.itemName,
          unit: form.unit,
          safetyStock: form.safetyStock,
        });
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err, "저장에 실패했습니다."));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {item ? "품목 수정" : "품목 등록"}
        </h2>

        <div className="space-y-3">
          {/* 품목 코드 - 등록 시에만 */}
          {!item && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                품목 코드 <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="예: ITM-006"
                value={form.itemCode}
                onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              품목명 <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="품목명 입력"
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              단위 <span className="text-red-500">*</span>
            </label>
            <select
              className={inputClass}
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            >
              {units.map((u) => (
                <option key={u.id} value={u.code}>
                  {u.codeName} ({u.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              안전재고
              <span className="text-xs text-gray-400 ml-1">
                (이 수량 미만이면 재고 부족으로 표시)
              </span>
            </label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.safetyStock}
              onChange={(e) =>
                setForm({ ...form, safetyStock: Number(e.target.value) })
              }
            />
          </div>

          {/* 사용여부 - 수정 시에만 */}
          {item && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사용여부
              </label>
              <select
                className={inputClass}
                value={form.useYn}
                onChange={(e) => setForm({ ...form, useYn: e.target.value })}
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
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {item ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
