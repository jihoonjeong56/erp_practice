import { useState } from "react";
import { inboundStock, outboundStock } from "../../api/inventory.api";
import type { Stock, StockTxType } from "../../types/inventory";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface Props {
  stock: Stock;
  type: StockTxType;
  unitLabel: string;
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function StockTxModal({
  stock,
  type,
  unitLabel,
  onClose,
  onSaved,
}: Props) {
  const isIn = type === "IN";
  const [quantity, setQuantity] = useState(1);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");

  const after = isIn ? stock.quantity + quantity : stock.quantity - quantity;
  const insufficient = !isIn && after < 0;
  const invalid = quantity < 1 || insufficient;

  const handleSubmit = async () => {
    setError("");
    try {
      const request = { quantity, memo: memo.trim() || undefined };
      if (isIn) {
        await inboundStock(stock.itemId, request);
      } else {
        await outboundStock(stock.itemId, request);
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err, "처리에 실패했습니다."));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {isIn ? "입고 처리" : "출고 처리"}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {stock.itemName}{" "}
          <span className="font-mono text-xs">({stock.itemCode})</span>
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              수량 ({unitLabel}) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메모
            </label>
            <input
              className={inputClass}
              placeholder={isIn ? "예: 정기 입고" : "예: 생산 투입"}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          {/* 처리 결과 미리보기 */}
          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 text-sm">
            <span className="text-gray-500">현재고</span>{" "}
            <b className="text-gray-800">{stock.quantity.toLocaleString()}</b>
            <span className="mx-2 text-gray-400">→</span>
            <span className="text-gray-500">처리 후</span>{" "}
            <b className={insufficient ? "text-red-600" : "text-gray-800"}>
              {after.toLocaleString()}
            </b>{" "}
            {unitLabel}
            {insufficient && (
              <p className="mt-1 text-xs text-red-600">재고가 부족합니다.</p>
            )}
          </div>
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
            disabled={invalid}
            className={`px-4 py-2 text-sm text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
              isIn
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-rose-500 hover:bg-rose-600"
            }`}
          >
            {isIn ? "입고" : "출고"}
          </button>
        </div>
      </div>
    </div>
  );
}