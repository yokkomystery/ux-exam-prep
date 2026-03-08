"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { KeywordCard } from "@/components/KeywordCard";
import { useProgress } from "@/hooks/useProgress";
import { categories } from "@/lib/categories";
import { keywords as allKeywords } from "@/data/keywords";

export default function KeywordPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const { progress, toggleKeywordLearned, isLoaded } = useProgress();
  const [filter, setFilter] = useState<"all" | "unlearned" | "learned">("all");

  const cat = categoryId === "all" ? null : categories.find((c) => c.id === categoryId);
  const categoryName = categoryId === "all" ? "全キーワード" : cat?.name ?? "不明";

  const filteredKeywords = (() => {
    let kws =
      categoryId === "all"
        ? allKeywords
        : allKeywords.filter((k) =>
            cat?.subcategories.includes(k.subcategory) ||
            k.category === (cat?.name ?? "")
          );

    if (filter === "learned") {
      kws = kws.filter((k) => progress.keywords.learnedKeywords.includes(k.id));
    } else if (filter === "unlearned") {
      kws = kws.filter(
        (k) => !progress.keywords.learnedKeywords.includes(k.id)
      );
    }
    return kws;
  })();

  const totalForCategory =
    categoryId === "all"
      ? allKeywords.length
      : allKeywords.filter(
          (k) =>
            cat?.subcategories.includes(k.subcategory) ||
            k.category === (cat?.name ?? "")
        ).length;
  const learnedForCategory =
    categoryId === "all"
      ? progress.keywords.learnedKeywords.length
      : allKeywords
          .filter(
            (k) =>
              cat?.subcategories.includes(k.subcategory) ||
              k.category === (cat?.name ?? "")
          )
          .filter((k) => progress.keywords.learnedKeywords.includes(k.id))
          .length;

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400 dark:text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/keywords"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ← キーワード一覧
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {categoryName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {learnedForCategory}/{totalForCategory} 覚えた
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "unlearned", "learned"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-orange-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {f === "all" ? "すべて" : f === "unlearned" ? "未学習" : "覚えた"}
          </button>
        ))}
      </div>

      {filteredKeywords.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          {filter === "learned"
            ? "まだ覚えたキーワードがありません"
            : filter === "unlearned"
            ? "全てのキーワードを覚えました！素晴らしい！"
            : "キーワードがありません"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredKeywords.map((keyword) => (
            <KeywordCard
              key={keyword.id}
              keyword={keyword}
              isLearned={progress.keywords.learnedKeywords.includes(keyword.id)}
              onToggleLearned={toggleKeywordLearned}
            />
          ))}
        </div>
      )}
    </div>
  );
}
