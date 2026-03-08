import Link from "next/link";
import { CategoryInfo } from "@/lib/types";

type CategoryListProps = {
  categories: CategoryInfo[];
  basePath: string;
  progress?: Record<string, { total: number; done: number }>;
};

const importanceLabel = (level: number) => {
  if (level === 3) return { text: "重要", color: "bg-red-100 text-red-700" };
  if (level === 2) return { text: "標準", color: "bg-yellow-100 text-yellow-700" };
  return { text: "基礎", color: "bg-gray-100 text-gray-600" };
};

export function CategoryList({
  categories,
  basePath,
  progress,
}: CategoryListProps) {
  return (
    <div className="space-y-2">
      {categories.map((cat) => {
        const imp = importanceLabel(cat.importance);
        const prog = progress?.[cat.id];
        const percentage =
          prog && prog.total > 0
            ? Math.round((prog.done / prog.total) * 100)
            : 0;

        return (
          <Link
            key={cat.id}
            href={`${basePath}/${cat.id}`}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${imp.color}`}
              >
                {imp.text}
              </span>
              <span className="font-medium text-gray-900">{cat.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {prog && (
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{percentage}%</span>
                </div>
              )}
              <span className="text-gray-400 text-sm">→</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
