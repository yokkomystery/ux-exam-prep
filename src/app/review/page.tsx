"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { QuizCard } from "@/components/QuizCard";
import { useProgress } from "@/hooks/useProgress";
import { questions as allQuestions } from "@/data/questions";
import { getWrongQuestionIds } from "@/lib/storage";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ReviewPage() {
  const { answerQuestion, isLoaded } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({ correct: 0, wrong: 0 });
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
        <div className="animate-pulse text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (wrongQuestions.length === 0) {
    return (
      <div className="space-y-6 text-center py-20">
        <div className="text-5xl">🎉</div>
        <h2 className="text-xl font-bold text-gray-900">
          間違えた問題はありません！
        </h2>
        <p className="text-gray-500">
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
    const total = results.correct + results.wrong;
    const accuracy = Math.round((results.correct / total) * 100);
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">復習結果</h2>
          <div className="text-6xl font-bold mb-4">
            <span className={accuracy >= 70 ? "text-green-600" : "text-red-600"}>
              {accuracy}%
            </span>
          </div>
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <div className="text-2xl font-bold text-green-600">{results.correct}</div>
              <div className="text-sm text-gray-500">正解</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{results.wrong}</div>
              <div className="text-sm text-gray-500">不正解</div>
            </div>
          </div>
          {accuracy >= 80 ? (
            <p className="text-green-600 font-medium">復習の成果が出てるぜ！</p>
          ) : (
            <p className="text-yellow-600 font-medium">もう少し復習を続けよう！</p>
          )}
        </div>
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 text-center py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            ダッシュボードに戻る
          </Link>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setResults({ correct: 0, wrong: 0 });
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
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← ダッシュボード
        </Link>
        <div className="text-sm text-gray-500">
          復習: {wrongQuestions.length}問
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1">
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
          setResults((prev) => ({
            correct: prev.correct + (correct ? 1 : 0),
            wrong: prev.wrong + (correct ? 0 : 1),
          }));
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
