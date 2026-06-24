export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2x1 font-bold text-gray-800 mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ lable: "전체 직원", value: "0명", color: "bg-indigo-500" }].map(
          (card) => (
            <div></div>
          ),
        )}
      </div>
    </div>
  );
}
