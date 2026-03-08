"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QuizCard } from "@/components/QuizCard";
import { useProgress } from "@/hooks/useProgress";
import { categories } from "@/lib/categories";
import { questions as allQuestions } from "@/data/questions";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const { answerQuestion, isLoaded } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ correct: number; wrong: number }>({
    correct: 0,
    wrong: 0,
  });
  const [isFinished, setIsFinished] = useState(false);

  const questions = useMemo(() => {
    if (categoryId === "all") {
      return shuffleArray(allQuestions);
    }
    if (categoryId === "random") {
      return shuffleArray(allQuestions).slice(0, 20);
    }
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return [];
    return shuffleArray(
      allQuestions.filter((q) =>
        cat.subcategories.some(
          (sub) => q.subcategory === sub || q.category === cat.name
        )
      )
    );
  }, [categoryId]);

  const categoryName =
    categoryId === "all"
      ? "全問チャレンジ"
      : categoryId === "random"
      ? "ランダム20問"
      : categories.find((c) => c.id === categoryId)?.name ?? "不明";

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">このカテゴリに問題がありません</p>
        <Link href="/quiz" className="text-blue-600 mt-4 inline-block">
          ← カテゴリ選択に戻る
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">結果発表</h2>
          <p className="text-gray-500 mb-6">{categoryName}</p>

          <div className="text-6xl font-bold mb-4">
            <span className={accuracy >= 70 ? "text-green-600" : "text-red-600"}>
              {accuracy}%
            </span>
          </div>

          <div className="flex justify-center gap-8 mb-6">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {results.correct}
              </div>
              <div className="text-sm text-gray-500">正解</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {results.wrong}
              </div>
              <div className="text-sm text-gray-500">不正解</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{total}</div>
              <div className="text-sm text-gray-500">合計</div>
            </div>
          </div>

          {accuracy >= 80 ? (
            <p className="text-green-600 font-medium">素晴らしい！合格圏内だぜ！</p>
          ) : accuracy >= 60 ? (
            <p className="text-yellow-600 font-medium">
              もう少し！間違えた問題を復習しよう！
            </p>
          ) : (
            <p className="text-red-600 font-medium">
              頑張ろう！キーワードを見直してから再挑戦だ！
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <Link
            href="/quiz"
            className="flex-1 text-center py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            カテゴリ選択に戻る
          </Link>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setResults({ correct: 0, wrong: 0 });
              setIsFinished(false);
            }}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            もう一度挑戦
          </button>
        </div>
        {results.wrong > 0 && (
          <Link
            href="/review"
            className="block text-center py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            間違えた問題を復習する
          </Link>
        )}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/quiz"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← {categoryName}
        </Link>
        <div className="text-sm text-gray-500">
          正解 {results.correct} / 不正解 {results.wrong}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1">
        <div
          className="bg-blue-500 h-1 rounded-full transition-all"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <QuizCard
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onAnswer={(id, correct) => {
          answerQuestion(id, correct);
          setResults((prev) => ({
            correct: prev.correct + (correct ? 1 : 0),
            wrong: prev.wrong + (correct ? 0 : 1),
          }));
        }}
        onNext={() => {
          if (currentIndex + 1 >= questions.length) {
            setIsFinished(true);
          } else {
            setCurrentIndex(currentIndex + 1);
          }
        }}
        isLast={currentIndex + 1 >= questions.length}
      />
    </div>
  );
}
