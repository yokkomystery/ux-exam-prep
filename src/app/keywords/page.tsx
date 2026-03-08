"use client";

import Link from "next/link";
import { categories } from "@/lib/categories";
import { keywords } from "@/data/keywords";
import { useProgress } from "@/hooks/useProgress";

export default function KeywordsCategoryPage() {
  const { progress, isLoaded } = useProgress();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">キーワード学習</h1>
        <p className="text-gray-500 mt-1">
          カテゴリを選んでフラッシュカードで学習しよう
        </p>
      </div>

      <Link
        href="/keywords/all"
        className="flex items-center justify-between p-5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
      >
        <div>
          <span className="font-bold text-lg">全キーワード</span>
          <span className="text-orange-200 text-sm ml-2">
            {keywords.length}件
          </span>
        </div>
        <span className="text-orange-200">→</span>
      </Link>

      <div className="space-y-2">
        {categories.map((cat) => {
          const catKeywords = keywords.filter((k) =>
            cat.subcategories.includes(k.subcategory) ||
            k.category === cat.name
          );
          const learnedCount = catKeywords.filter((k) =>
            progress.keywords.learnedKeywords.includes(k.id)
          ).length;
          const percentage =
            catKeywords.length > 0
              ? Math.round((learnedCount / catKeywords.length) * 100)
              : 0;

          const importanceStyle =
            cat.importance === 3
              ? "bg-red-100 text-red-700"
              : cat.importance === 2
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600";
          const importanceText =
            cat.importance === 3 ? "重要" : cat.importance === 2 ? "標準" : "基礎";

          return (
            <Link
              key={cat.id}
              href={`/keywords/${cat.id}`}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${importanceStyle}`}
                >
                  {importanceText}
                </span>
                <div>
                  <span className="font-medium text-gray-900">{cat.name}</span>
                  <span className="text-gray-400 text-sm ml-2">
                    {catKeywords.length}件
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {learnedCount}/{catKeywords.length} 覚えた
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-orange-500 h-1.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-400 text-sm">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
