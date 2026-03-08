"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { QuizCard } from "@/components/QuizCard";
import { useProgress } from "@/hooks/useProgress";
import { questions as allQuestions } from "@/data/questions";
import { getWrongQuestionIds } from "@/lib/storage";
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

export default function ReviewPage() {
  const { answerQuestion, isLoaded } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const wrongQuestions = useMemo(() => {
    if (!isLoaded) return [];
    const wrongIds = getWrongQuestionIds();
    return shuffleArray(
      allQuestions.filter((q) => wrongIds.includes(q.id))
    );
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400 dark:text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (wrongQuestions.length === 0) {
    return (
      <div className="space-y-6 text-center py-20">
        <div className="text-5xl">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          間違えた問題はありません！
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          まだクイズに挑戦していないか、全問正解しています。
        </p>
        <Link
          href="/quiz"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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

    // 分野別正答率
    const categoryStats: Record<string, { correct: number; total: number }> = {};
    for (const a of answers) {
      const cat = a.question.category;
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
      categoryStats[cat].total++;
      if (a.correct) categoryStats[cat].correct++;
    }
    const sortedCategories = Object.entries(categoryStats).sort(
      ([, a], [, b]) => (a.correct / a.total) - (b.correct / b.total)
    );

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">復習結果</h2>
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

        {/* 分野別正答率 */}
        {Object.keys(categoryStats).length > 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">分野別正答率</h3>
            <div className="space-y-3">
              {sortedCategories.map(([cat, s]) => {
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300 w-40 shrink-0 truncate">{cat}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">
                      {pct}% ({s.correct}/{s.total})
                    </span>
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
            onClick={() => {
              setCurrentIndex(0);
              setAnswers([]);
              setIsFinished(false);
            }}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            もう一度復習
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = wrongQuestions[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          ← ダッシュボード
        </Link>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          復習: {wrongQuestions.length}問
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
        <div
          className="bg-red-500 h-1 rounded-full transition-all"
          style={{
            width: `${((currentIndex + 1) / wrongQuestions.length) * 100}%`,
          }}
        />
      </div>

      <QuizCard
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={wrongQuestions.length}
        onAnswer={(id, correct) => {
          answerQuestion(id, correct);
          setAnswers((prev) => [...prev, { id, correct, question: currentQuestion }]);
        }}
        onNext={() => {
          if (currentIndex + 1 >= wrongQuestions.length) {
            setIsFinished(true);
          } else {
            setCurrentIndex(currentIndex + 1);
          }
        }}
        isLast={currentIndex + 1 >= wrongQuestions.length}
      />
    </div>
  );
}
