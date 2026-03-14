"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { ProgressBar } from "@/components/ProgressBar";
import { categories } from "@/lib/categories";
import { questions } from "@/data/questions";
import { keywords } from "@/data/keywords";

export default function Dashboard() {
  const { progress, isLoaded } = useProgress();

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(progress.quiz.answeredQuestions).length;
  const correctCount = Object.values(progress.quiz.answeredQuestions).filter(
    (v) => v.correct
  ).length;
  const wrongCount = answeredCount - correctCount;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const unansweredCount = totalQuestions - answeredCount;

  const totalKeywords = keywords.length;
  const learnedCount = progress.keywords.learnedKeywords.length;

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400 dark:text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">UX検定基礎 対策</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">UX検定基礎試験に向けた学習ダッシュボード</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">クイズ進捗</div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {answeredCount}<span className="text-lg text-gray-400 dark:text-gray-500">/{totalQuestions}</span>
          </div>
          <ProgressBar value={answeredCount} max={totalQuestions} color="blue" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">正答率</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {accuracy}<span className="text-lg text-gray-400 dark:text-gray-500">%</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            正解 {correctCount} / 不正解 {wrongCount}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">キーワード学習</div>
          <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
            {learnedCount}<span className="text-lg text-gray-400 dark:text-gray-500">/{totalKeywords}</span>
          </div>
          <ProgressBar value={learnedCount} max={totalKeywords} color="teal" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/quiz"
          className="flex flex-col items-center justify-center p-8 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm"
        >
          <span className="text-3xl mb-2">📝</span>
          <span className="font-bold text-lg">クイズに挑戦</span>
          <span className="text-indigo-200 text-sm mt-1">4択問題で知識を確認</span>
        </Link>

        <Link
          href="/keywords"
          className="flex flex-col items-center justify-center p-8 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:bg-teal-800 transition-colors shadow-sm"
        >
          <span className="text-3xl mb-2">🔑</span>
          <span className="font-bold text-lg">キーワード学習</span>
          <span className="text-teal-200 text-sm mt-1">フラッシュカードで暗記</span>
        </Link>
      </div>

      {unansweredCount > 0 && (
        <Link
          href="/quiz/unanswered"
          className="flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
        >
          <div>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">未回答だけを解く</span>
            <span className="text-emerald-500 dark:text-emerald-400 text-sm ml-2">
              残り {unansweredCount}問
            </span>
          </div>
          <span className="text-emerald-400 dark:text-emerald-500" aria-hidden="true">→</span>
        </Link>
      )}

      {wrongCount > 0 && (
        <Link
          href="/review"
          className="flex items-center justify-between p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
        >
          <div>
            <span className="font-bold text-rose-700 dark:text-rose-300">間違えた問題を復習</span>
            <span className="text-rose-500 dark:text-rose-400 text-sm ml-2">
              {wrongCount}問
            </span>
          </div>
          <span className="text-rose-400 dark:text-rose-500" aria-hidden="true">→</span>
        </Link>
      )}

      {progress.quiz.bookmarkedQuestions.length > 0 && (
        <Link
          href="/review"
          className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="font-bold text-amber-700 dark:text-amber-300">ブックマーク</span>
            <span className="text-amber-500 dark:text-amber-400 text-sm">
              {progress.quiz.bookmarkedQuestions.length}問
            </span>
          </div>
          <span className="text-amber-400 dark:text-amber-500" aria-hidden="true">→</span>
        </Link>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">カテゴリ別進捗</h2>
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
            const catAccuracy =
              catAnswered > 0 ? Math.round((catCorrect / catAnswered) * 100) : 0;

            return (
              <div
                key={cat.id}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:w-48 sm:shrink-0 truncate">
                  {cat.name}
                </span>
                <div className="flex items-center gap-2 w-full sm:flex-1">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all"
                      style={{
                        width: `${
                          catQuestions.length > 0
                            ? (catAnswered / catQuestions.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                    {catAnswered}/{catQuestions.length}問{" "}
                    {catAnswered > 0 && `(${catAccuracy}%)`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
