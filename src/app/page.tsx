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

  const totalKeywords = keywords.length;
  const learnedCount = progress.keywords.learnedKeywords.length;

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">UX検定基礎 対策</h1>
        <p className="text-gray-500 mt-1">第12回 UX検定基礎試験に向けた学習ダッシュボード</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">クイズ進捗</div>
          <div className="text-3xl font-bold text-blue-600">
            {answeredCount}<span className="text-lg text-gray-400">/{totalQuestions}</span>
          </div>
          <ProgressBar value={answeredCount} max={totalQuestions} color="blue" />
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">正答率</div>
          <div className="text-3xl font-bold text-green-600">
            {accuracy}<span className="text-lg text-gray-400">%</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            正解 {correctCount} / 不正解 {wrongCount}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">キーワード学習</div>
          <div className="text-3xl font-bold text-orange-500">
            {learnedCount}<span className="text-lg text-gray-400">/{totalKeywords}</span>
          </div>
          <ProgressBar value={learnedCount} max={totalKeywords} color="orange" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/quiz"
          className="flex flex-col items-center justify-center p-8 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span className="text-3xl mb-2">📝</span>
          <span className="font-bold text-lg">クイズに挑戦</span>
          <span className="text-blue-200 text-sm mt-1">4択問題で知識を確認</span>
        </Link>

        <Link
          href="/keywords"
          className="flex flex-col items-center justify-center p-8 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
        >
          <span className="text-3xl mb-2">🔑</span>
          <span className="font-bold text-lg">キーワード学習</span>
          <span className="text-orange-200 text-sm mt-1">フラッシュカードで暗記</span>
        </Link>
      </div>

      {wrongCount > 0 && (
        <Link
          href="/review"
          className="flex items-center justify-between p-5 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
        >
          <div>
            <span className="font-bold text-red-700">間違えた問題を復習</span>
            <span className="text-red-500 text-sm ml-2">
              {wrongCount}問
            </span>
          </div>
          <span className="text-red-400">→</span>
        </Link>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">カテゴリ別進捗</h2>
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
                className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100"
              >
                <span className="text-sm font-medium text-gray-700 w-48 shrink-0">
                  {cat.name}
                </span>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{
                        width: `${
                          catQuestions.length > 0
                            ? (catAnswered / catQuestions.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500 w-24 text-right">
                  {catAnswered}/{catQuestions.length}問{" "}
                  {catAnswered > 0 && `(${catAccuracy}%)`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
