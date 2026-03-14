"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QuizCard } from "@/components/QuizCard";
import { Timer } from "@/components/Timer";
import { useProgress } from "@/hooks/useProgress";
import { categories } from "@/lib/categories";
import { questions as allQuestions } from "@/data/questions";
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

function buildSessionQuestions(
  categoryId: string,
  baseQuestions: Question[],
  answeredQuestions: Record<string, { correct: boolean; answeredAt: number }>
) {
  if (categoryId === "all") {
    return shuffleArray(allQuestions);
  }
  if (categoryId === "random") {
    return shuffleArray(allQuestions).slice(0, 10);
  }
  if (categoryId === "unanswered") {
    return shuffleArray(
      allQuestions.filter((q) => !answeredQuestions[q.id])
    );
  }
  return shuffleArray(baseQuestions);
}

export default function QuizPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const { answerQuestion, toggleQuestionBookmark, progress, isLoaded } = useProgress();

  const baseQuestions = useMemo(() => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return [];
    return allQuestions.filter((q) =>
      cat.subcategories.some(
        (sub) => q.subcategory === sub || q.category === cat.name
      )
    );
  }, [categoryId]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400 dark:text-gray-500">読み込み中...</div>
      </div>
    );
  }

  const questions = buildSessionQuestions(
    categoryId,
    baseQuestions,
    progress.quiz.answeredQuestions
  );

  return (
    <QuizSession
      key={categoryId}
      categoryId={categoryId}
      initialQuestions={questions}
      progress={progress}
      answerQuestion={answerQuestion}
      toggleQuestionBookmark={toggleQuestionBookmark}
    />
  );
}

type QuizSessionProps = {
  categoryId: string;
  initialQuestions: Question[];
  progress: ReturnType<typeof useProgress>["progress"];
  answerQuestion: (questionId: string, correct: boolean) => void;
  toggleQuestionBookmark: (questionId: string) => void;
};

function QuizSession({
  categoryId,
  initialQuestions,
  progress,
  answerQuestion,
  toggleQuestionBookmark,
}: QuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [questions] = useState(initialQuestions);

  const categoryName =
    categoryId === "all"
      ? "全問チャレンジ"
      : categoryId === "unanswered"
      ? "未回答だけ"
      : categoryId === "random"
      ? "ランダム10問"
      : categories.find((c) => c.id === categoryId)?.name ?? "不明";

  const showTimer = categoryId === "all";

  const handleFinish = useCallback(() => {
    setIsFinished(true);
  }, []);

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">
          {categoryId === "unanswered"
            ? "未回答の問題はありません"
            : "このカテゴリに問題がありません"}
        </p>
        <Link href="/quiz" className="text-indigo-600 dark:text-indigo-400 mt-4 inline-block">
          ← カテゴリ選択に戻る
        </Link>
      </div>
    );
  }

  if (isFinished) {
    const correct = answers.filter((a) => a.correct).length;
    const wrong = answers.filter((a) => !a.correct).length;
    const total = answers.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // 分野別正答率を計算
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

    // 難易度別正答率
    const diffStats: Record<string, { correct: number; total: number }> = {};
    for (const a of answers) {
      const d = a.question.difficulty;
      if (!diffStats[d]) diffStats[d] = { correct: 0, total: 0 };
      diffStats[d].total++;
      if (a.correct) diffStats[d].correct++;
    }

    // 弱点分野（正答率60%未満）
    const weakCategories = sortedCategories.filter(
      ([, s]) => s.total >= 2 && (s.correct / s.total) < 0.6
    );

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">結果発表</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{categoryName}</p>

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
            <div>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{total}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">合計</div>
            </div>
          </div>

          {accuracy >= 80 ? (
            <p className="text-green-600 font-medium">素晴らしい！合格圏内だぜ！</p>
          ) : accuracy >= 60 ? (
            <p className="text-yellow-600 font-medium">もう少し！間違えた問題を復習しよう！</p>
          ) : (
            <p className="text-red-600 font-medium">頑張ろう！キーワードを見直してから再挑戦だ！</p>
          )}
        </div>

        {/* 難易度別正答率 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">難易度別正答率</h3>
          <div className="space-y-3">
            {(["basic", "standard", "advanced"] as const).map((d) => {
              const s = diffStats[d];
              if (!s) return null;
              const pct = Math.round((s.correct / s.total) * 100);
              const label = d === "basic" ? "基本" : d === "standard" ? "標準" : "応用";
              return (
                <div key={d} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300 w-12">{label}</span>
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

        {/* 分野別正答率 */}
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

        {/* 弱点分野アドバイス */}
        {weakCategories.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-6">
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-3">弱点分野のアドバイス</h3>
            <ul className="space-y-2">
              {weakCategories.map(([cat, s]) => {
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <li key={cat} className="text-sm text-amber-700 dark:text-amber-200">
                    <span className="font-medium">{cat}</span>（正答率{pct}%）
                    — キーワードの定義を重点的に復習しよう
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            href="/quiz"
            className="flex-1 text-center py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            カテゴリ選択に戻る
          </Link>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setAnswers([]);
              setIsFinished(false);
            }}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            もう一度挑戦
          </button>
        </div>
        {wrong > 0 && (
          <Link
            href="/review"
            className="block text-center py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors font-medium"
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/quiz"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 min-h-[44px] inline-flex items-center"
        >
          ← {categoryName}
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {showTimer && <Timer durationMinutes={100} onTimeUp={handleFinish} />}
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            正解 {answers.filter((a) => a.correct).length} / 不正解 {answers.filter((a) => !a.correct).length}
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
        <div
          className="bg-indigo-500 h-1 rounded-full transition-all"
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
          setAnswers((prev) => [...prev, { id, correct, question: currentQuestion }]);
        }}
        onNext={() => {
          if (currentIndex + 1 >= questions.length) {
            setIsFinished(true);
          } else {
            setCurrentIndex(currentIndex + 1);
          }
        }}
        isLast={currentIndex + 1 >= questions.length}
        isBookmarked={progress.quiz.bookmarkedQuestions.includes(currentQuestion.id)}
        onToggleBookmark={toggleQuestionBookmark}
      />
    </div>
  );
}
