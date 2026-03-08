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
        <div className="animate-pulse text-gray-400 dark:text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">キーワード学習</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          カテゴリを選んでフラッシュカードで学習しよう
        </p>
      </div>

      <Link
        href="/keywords/all"
        className="flex items-center justify-between p-5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:bg-teal-800 transition-colors"
      >
        <div>
          <span className="font-bold text-lg block">全キーワード</span>
          <span className="text-teal-200 text-sm">
            {keywords.length}件
          </span>
        </div>
        <span className="text-teal-200 text-xl" aria-hidden="true">→</span>
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
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : cat.importance === 2
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
          const importanceText =
            cat.importance === 3 ? "重要" : cat.importance === 2 ? "標準" : "基礎";

          return (
            <Link
              key={cat.id}
              href={`/keywords/${cat.id}`}
              className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-sm transition-all min-h-[48px]"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${importanceStyle}`}
                >
                  {importanceText}
                </span>
                <div className="min-w-0">
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate block">{cat.name}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                    {catKeywords.length}件 / {learnedCount}覚えた
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-400 dark:text-gray-500 text-sm" aria-hidden="true">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
