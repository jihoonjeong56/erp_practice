interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const VISIBLE_PAGES = 5;

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  // 현재 페이지를 가운데에 두고 최대 5개 번호만
  const start = Math.max(
    0,
    Math.min(page - Math.floor(VISIBLE_PAGES / 2), totalPages - VISIBLE_PAGES),
  );
  const end = Math.min(totalPages, start + VISIBLE_PAGES);
  const pages = Array.from({ length: end - start }, (_, i) => start + i);
  const base = "px-3 py-1.5 text-sm rounded-lg border transition-colors";
  const idle = "border-gray-300 text-gray-600 hover:bg-gray-50";
  const disabled = "disabled:text-gray-300 disabled:cursor-not-allowed";

  return (
    <nav>
      <button
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className={`${base} ${idle} ${disabled}`}
      >
        이전
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`${base} ${
            p === page ? "bg-indigo-600 border-indigo-600 text-white" : idle
          }`}
        >
          {p + 1}
        </button>
      ))}
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
        className={`${base} ${idle} ${disabled}`}
      >
        다음
      </button>
    </nav>
  );
}
