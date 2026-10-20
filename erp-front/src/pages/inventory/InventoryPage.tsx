import { useCallback, useEffect, useState } from "react";
import type { Item, Stock, StockTxType } from "../../types/inventory";
import type { CommonCode } from "../../types/code";
import { getItems, getStocks } from "../../api/inventory.api";
import { getCommonCode } from "../../api/code.api";
import { getErrorMessage } from "../../utils/getErrorMessage";

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
      {/* 검색/ 필터 */}
      <div>
        <input
          className="border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="품목명, 품목코드 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {(["ALL", "LOw"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "ALL" ? "전체" : `재고부족(${lowCount})`}
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
              {[
                "품목코드",
                "품목명",
                "현 재고",
                "안전제고",
                "상태",
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
          <tbody className="divide-y divide-gray-50"></tbody>
        </table>
      </div>
    </div>
  );
}
