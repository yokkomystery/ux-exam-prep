"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { QuizCard } from "@/components/QuizCard";
import { useProgress } from "@/hooks/useProgress";
import { questions as allQuestions } from "@/data/questions";
import { getWrongQuestionIds, getEverWrongQuestionIds } from "@/lib/storage";
import { Question } from "@/lib/types";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type AnswerRecord = { id: string; correct: boolean; question: Question };
type ReviewTab = "wrong" | "history" | "bookmarked";

const tabLabels: Record<ReviewTab, string> = {
  wrong: "未正解",
  history: "間違え履歴",
  bookmarked: "ブックマーク",
};

export default function ReviewPage() {
  const { answerQuestion, toggleQuestionBookmark, progress, isLoaded } = useProgress();
  const [tab, setTab] = useState<ReviewTab>("wrong");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const wrongQuestions = useMemo(() => {
    if (!isLoaded) return [];
    const wrongIds = getWrongQuestionIds();
    return shuffleArray(allQuestions.filter((q) => wrongIds.includes(q.id)));
  }, [isLoaded]);

  const everWrongQuestions = useMemo(() => {
    if (!isLoaded) return [];
    const ids = getEverWrongQuestionIds();
    return shuffleArray(allQuestions.filter((q) => ids.includes(q.id)));
  }, [isLoaded]);

  const bookmarkedQuestions = useMemo(() => {
    if (!isLoaded) return [];
    return shuffleArray(
      allQuestions.filter((q) => progress.quiz.bookmarkedQuestions.includes(q.id))
    );
  }, [isLoaded, progress.quiz.bookmarkedQuestions]);

  const currentQuestions =
    tab === "wrong" ? wrongQuestions : tab === "history" ? everWrongQuestions : bookmarkedQuestions;

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setIsFinished(false);
  }, []);

  const handleTabChange = (newTab: ReviewTab) => {
    setTab(newTab);
    resetQuiz();
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400 dark:text-gray-500">読み込み中...</div>
      </div>
    );
  }

  const tabCounts: Record<ReviewTab, number> = {
    wrong: wrongQuestions.length,
    history: everWrongQuestions.length,
    bookmarked: bookmarkedQuestions.length,
  };

  // 全タブが空
  if (tabCounts.wrong === 0 && tabCounts.history === 0 && tabCounts.bookmarked === 0) {
    return (
      <div className="space-y-6 text-center py-20">
        <div className="text-5xl">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          復習する問題はありません！
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          クイズに挑戦して、気になる問題をブックマークしよう。
        </p>
        <Link
          href="/quiz"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          クイズに挑戦する
        </Link>
      </div>
    );
  }

  if (isFinished) {
    const correct = answers.filter((a) => a.correct).length;
    const wrong = answers.filter((a) => !a.correct).length;
    const total = answers.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const categoryStats: Record<string, { correct: number; total: number }> = {};
    for (const a of answers) {
      const cat = a.question.category;
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
      categoryStats[cat].total++;
      if (a.correct) categoryStats[cat].correct++;
    }
    const sortedCategories = Object.entries(categoryStats).sort(
      ([, a], [, b]) => a.correct / a.total - b.correct / b.total
    );

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">復習結果</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{tabLabels[tab]}</p>
          <div className="text-6xl font-bold mb-4">
            <span className={accuracy >= 70 ? "text-green-600" : "text-red-600"}>
              {accuracy}%
            </span>
          </div>
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <div className="text-2xl font-bold text-green-600">{correct}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">正解</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{wrong}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">不正解</div>
            </div>
          </div>
          {accuracy >= 80 ? (
            <p className="text-green-600 font-medium">復習の成果が出てるぜ！</p>
          ) : (
            <p className="text-yellow-600 font-medium">もう少し復習を続けよう！</p>
          )}
        </div>

        {Object.keys(categoryStats).length > 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">分野別正答率</h3>
            <div className="space-y-3">
              {sortedCategories.map(([cat, s]) => {
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <div key={cat} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300 sm:w-40 sm:shrink-0 truncate">{cat}</span>
                    <div className="flex items-center gap-2 w-full sm:flex-1">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 shrink-0">
                        {pct}% ({s.correct}/{s.total})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 text-center py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            ダッシュボードに戻る
          </Link>
          <button
            onClick={resetQuiz}
            className="flex-1 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
          >
            もう一度復習
          </button>
        </div>
      </div>
    );
  }

  // タブUI + クイズ表示
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 min-h-[44px] inline-flex items-center">
          ← ダッシュボード
        </Link>
      </div>

      {/* タブ */}
      <div className="flex gap-2">
        {(["wrong", "history", "bookmarked"] as const).map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              tab === t
                ? "bg-rose-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {tabLabels[t]}
            <span className="ml-1 opacity-75">({tabCounts[t]})</span>
          </button>
        ))}
      </div>

      {/* 空の場合 */}
      {currentQuestions.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          {tab === "wrong" && "現在、未正解の問題はありません"}
          {tab === "history" && "まだ間違えた問題はありません"}
          {tab === "bookmarked" && "ブックマークした問題はありません。クイズ回答後にブックマークできます"}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>復習: {currentQuestions.length}問</span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div
              className="bg-rose-500 h-1 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / currentQuestions.length) * 100}%`,
              }}
            />
          </div>

          <QuizCard
            key={`${tab}-${currentQuestions[currentIndex].id}`}
            question={currentQuestions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={currentQuestions.length}
            onAnswer={(id, correct) => {
              answerQuestion(id, correct);
              setAnswers((prev) => [...prev, { id, correct, question: currentQuestions[currentIndex] }]);
            }}
            onNext={() => {
              if (currentIndex + 1 >= currentQuestions.length) {
                setIsFinished(true);
              } else {
                setCurrentIndex(currentIndex + 1);
              }
            }}
            isLast={currentIndex + 1 >= currentQuestions.length}
            isBookmarked={progress.quiz.bookmarkedQuestions.includes(currentQuestions[currentIndex].id)}
            onToggleBookmark={toggleQuestionBookmark}
          />
        </>
      )}
    </div>
  );
}
