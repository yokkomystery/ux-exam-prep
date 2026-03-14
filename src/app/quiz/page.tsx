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
        <div className="animate-pulse text-gray-400 dark:text-gray-500">読み込み中...</div>
      </div>
    );
  }

  const unansweredCount = questions.filter(
    (q) => !progress.quiz.answeredQuestions[q.id]
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">クイズモード</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">カテゴリを選んで問題に挑戦しよう</p>
      </div>

      <Link
        href="/quiz/all"
        className="flex items-center justify-between p-5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
      >
        <div>
          <span className="font-bold text-lg block">全問チャレンジ</span>
          <span className="text-indigo-200 text-sm">
            {questions.length}問 / 100分タイマー付き
          </span>
        </div>
        <span className="text-indigo-200 text-xl" aria-hidden="true">→</span>
      </Link>

      <Link
        href="/quiz/random"
        className="flex items-center justify-between p-5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 active:bg-violet-800 transition-colors"
      >
        <div>
          <span className="font-bold text-lg block">ランダム10問</span>
          <span className="text-violet-200 text-sm">
            全カテゴリからランダムに出題
          </span>
        </div>
        <span className="text-violet-200 text-xl" aria-hidden="true">→</span>
      </Link>

      <Link
        href="/quiz/unanswered"
        className={`flex items-center justify-between p-5 rounded-xl transition-colors ${
          unansweredCount > 0
            ? "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
            : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
        }`}
        aria-disabled={unansweredCount === 0}
      >
        <div>
          <span className="font-bold text-lg block">未回答だけを解く</span>
          <span className={unansweredCount > 0 ? "text-emerald-100 text-sm" : "text-gray-400 dark:text-gray-500 text-sm"}>
            {unansweredCount > 0
              ? `まだ解いていない ${unansweredCount} 問に絞って出題`
              : "全問回答済みです"}
          </span>
        </div>
        <span className={unansweredCount > 0 ? "text-emerald-100 text-xl" : "text-gray-400 dark:text-gray-500 text-xl"} aria-hidden="true">→</span>
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
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : cat.importance === 2
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
          const importanceText =
            cat.importance === 3 ? "重要" : cat.importance === 2 ? "標準" : "基礎";

          return (
            <Link
              key={cat.id}
              href={`/quiz/${cat.id}`}
              className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all min-h-[48px]"
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
                    {catQuestions.length}問
                    {catAnswered > 0 && (
                      <span className="ml-1.5">{percentage}% / 正答率{accuracy}%</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
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
