"use client";

import Link from "next/link";
import { categories } from "@/lib/categories";
import { questions } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";

export default function QuizCategoryPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">クイズモード</h1>
        <p className="text-gray-500 mt-1">カテゴリを選んで問題に挑戦しよう</p>
      </div>

      <Link
        href="/quiz/all"
        className="flex items-center justify-between p-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        <div>
          <span className="font-bold text-lg">全問チャレンジ</span>
          <span className="text-blue-200 text-sm ml-2">
            {questions.length}問
          </span>
        </div>
        <span className="text-blue-200">→</span>
      </Link>

      <Link
        href="/quiz/random"
        className="flex items-center justify-between p-5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
      >
        <div>
          <span className="font-bold text-lg">ランダム20問</span>
          <span className="text-purple-200 text-sm ml-2">
            全カテゴリからランダムに出題
          </span>
        </div>
        <span className="text-purple-200">→</span>
      </Link>

      <div className="space-y-2">
        {categories.map((cat) => {
          const catQuestions = questions.filter((q) =>
            cat.subcategories.some(
              (sub) => q.subcategory === sub || q.category === cat.name
            )
          );
          const catAnswered = catQuestions.filter(
            (q) => progress.quiz.answeredQuestions[q.id]
          ).length;
          const catCorrect = catQuestions.filter(
            (q) => progress.quiz.answeredQuestions[q.id]?.correct
          ).length;
          const percentage =
            catQuestions.length > 0
              ? Math.round((catAnswered / catQuestions.length) * 100)
              : 0;
          const accuracy =
            catAnswered > 0 ? Math.round((catCorrect / catAnswered) * 100) : 0;

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
              href={`/quiz/${cat.id}`}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
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
                    {catQuestions.length}問
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {catAnswered > 0 && (
                  <span className="text-xs text-gray-500">
                    {percentage}% 完了 / 正答率 {accuracy}%
                  </span>
                )}
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
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
