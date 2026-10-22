import { useCallback, useEffect, useState } from "react";
import { getCommonCode } from "../../api/code.api";
import { getItems, getStocks } from "../../api/inventory.api";
import type { CommonCode } from "../../types/code";
import type { Item, Stock, StockTxType } from "../../types/inventory";
import { getErrorMessage } from "../../utils/getErrorMessage";
import ItemFormModal from "./ItemFormModal";
import StockTxModal from "./StockTxModal";

type Filter = "ALL" | "LOW";

export default function InventoryPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [units, setUnits] = useState<CommonCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [keyword, setKeyword] = useState("");

  // 모달 상태
  const [itemModal, setItemModal] = useState<{ item: Item | null } | null>(
    null,
  );
  const [txModal, setTxModal] = useState<{
    stock: Stock;
    type: StockTxType;
  } | null>(null);
  const [historyStock, setHistoryStock] = useState<Stock | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [stockData, itemData, unitData] = await Promise.all([
        getStocks(),
        getItems(),
        getCommonCode("ITEM_UNIT"),
      ]);
      setStocks(stockData);
      setItems(itemData);
      setUnits(unitData);
    } catch (err) {
      setError(getErrorMessage(err, "데이터를 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const itemMap = new Map(items.map((i) => [i.id, i]));
  const unitMap = new Map(units.map((u) => [u.code, u.codeName]));
  const unitLabel = (code: string) => unitMap.get(code) ?? code;

  const filtered = stocks.filter((s) => {
    const kw = keyword.trim().toLowerCase();
    const matchFilter = filter === "ALL" || s.lowStock;
    const matchKeyword =
      !kw ||
      s.itemName.toLowerCase().includes(kw) ||
      s.itemCode.toLowerCase().includes(kw);
    return matchFilter && matchKeyword;
  });

  const lowCount = stocks.filter((s) => s.lowStock).length;

  const handleSaved = () => {
    setItemModal(null);
    setTxModal(null);
    fetchAll();
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">재고 관리</h1>
        <button
          onClick={() => setItemModal({ item: null })}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 품목 등록
        </button>
      </div>

      {/* 검색 / 필터 */}
      <div className="flex gap-3 mb-4">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="품목명, 품목코드 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {(["ALL", "LOW"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "ALL" ? "전체" : `재고 부족 (${lowCount})`}
          </button>
        ))}
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
              {["품목코드", "품목명", "현재고", "안전재고", "상태", "관리"].map(
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
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  표시할 품목이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const item = itemMap.get(s.itemId);
                const unused = item?.useYn === "N";
                return (
                  <tr
                    key={s.itemId}
                    className={`transition-colors ${
                      unused
                        ? "opacity-50 bg-gray-50"
                        : s.lowStock
                          ? "bg-red-50/50 hover:bg-red-50"
                          : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-indigo-600 text-xs">
                      {s.itemCode}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {s.itemName}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {s.quantity.toLocaleString()} {unitLabel(s.unit)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {s.safetyStock.toLocaleString()} {unitLabel(s.unit)}
                    </td>
                    <td className="px-4 py-3">
                      {unused ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          미사용
                        </span>
                      ) : s.lowStock ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          재고 부족
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          정상
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          disabled={unused}
                          onClick={() => setTxModal({ stock: s, type: "IN" })}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium disabled:text-gray-300 disabled:cursor-not-allowed"
                        >
                          입고
                        </button>
                        <button
                          disabled={unused}
                          onClick={() => setTxModal({ stock: s, type: "OUT" })}
                          className="text-xs text-rose-500 hover:text-rose-700 font-medium disabled:text-gray-300 disabled:cursor-not-allowed"
                        >
                          출고
                        </button>
                        <button
                          onClick={() => setHistoryStock(s)}
                          className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                        >
                          이력
                        </button>
                        <button
                          onClick={() => item && setItemModal({ item })}
                          className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                        >
                          수정
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* 하단 요약 */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex gap-4 text-xs text-gray-500">
          <span>
            전체 품목 <b className="text-gray-700">{stocks.length}</b>개
          </span>
          <span>
            재고 부족 <b className="text-red-600">{lowCount}</b>개
          </span>
        </div>
      </div>

      {/* 모달 */}
      {itemModal && (
        <ItemFormModal
          item={itemModal.item}
          units={units}
          onClose={() => setItemModal(null)}
          onSaved={handleSaved}
        />
      )}
      {txModal && (
        <StockTxModal
          stock={txModal.stock}
          type={txModal.type}
          unitLabel={unitLabel(txModal.stock.unit)}
          onClose={() => setTxModal(null)}
          onSaved={handleSaved}
        />
      )}
      {historyStock && (
        <StockHistoryModal
          stock={historyStock}
          onClose={() => setHistoryStock(null)}
        />
      )}
    </div>
  );
}
