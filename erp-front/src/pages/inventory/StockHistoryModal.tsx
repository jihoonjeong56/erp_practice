import { useEffect, useState } from "react";
import { getStockHistories } from "../../api/inventory.api";
import type { Stock, StockHistory } from "../../types/inventory";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface Props {
  stock: Stock;
  onClose: () => void;
}

export default function StockHistoryModal({ stock, onClose }: Props) {
  const [histories, setHistories] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStockHistories(stock.itemId)
      .then((data) => {
        if (active) setHistories(data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "이력을 불러오지 못했습니다."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [stock.itemId]);

  const formatDate = (value: string | null) =>
    value ? value.replace("T", " ").slice(0, 16) : "-";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">입출고 이력</h2>
            <p className="text-sm text-gray-500">
              {stock.itemName}{" "}
              <span className="font-mono text-xs">({stock.itemCode})</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            닫기
          </button>
        </div>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <div className="overflow-y-auto border border-gray-100 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
              <tr>
                {["일시", "구분", "수량", "처리 후 재고", "메모", "처리자"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    불러오는 중...
                  </td>
                </tr>
              ) : histories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    입출고 이력이 없습니다.
                  </td>
                </tr>
              ) : (
                histories.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(h.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          h.txType === "IN"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {h.txType === "IN" ? "입고" : "출고"}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 font-medium ${
                        h.txType === "IN" ? "text-indigo-600" : "text-rose-600"
                      }`}
                    >
                      {h.txType === "IN" ? "+" : "-"}
                      {h.quantity.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {h.afterQuantity.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{h.memo ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {h.processedBy ?? "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}