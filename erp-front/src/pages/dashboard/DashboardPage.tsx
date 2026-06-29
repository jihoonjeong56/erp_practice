export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2x1 font-bold text-gray-800 mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { lable: "전체 직원", value: "0명", color: "bg-indigo-500" },
          { lable: "부서 수", value: "0RO", color: "bg-teal-500" },
          { lable: "재고 품목", value: "0개", color: "bg-amber-500" },
          { lable: "진행 중 발주", value: "0건", color: "bg-rose-500" },
        ].map((card) => (
          <div
            key={card.lable}
            className="bg-white rounded-x1 shadow-sm p-6 border border-gray-100"
          >
            <div
              className={`
                w-10 h-10 ${card.color} rounded-lg mb-3
              `}
            />
            <p className="text-sm text-gray-500">{card.lable}</p>
            <p className="text-2x1 font-bold text-gray-800 mt-1">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
