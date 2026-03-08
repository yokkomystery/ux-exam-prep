"use client";

import { useState } from "react";
import { Question } from "@/lib/types";

type QuizCardProps = {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
};

const difficultyLabel = {
  basic: { text: "基本", style: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  standard: { text: "標準", style: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  advanced: { text: "応用", style: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  isLast,
}: QuizCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
    onAnswer(question.id, index === question.correctIndex);
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setAnswered(false);
    onNext();
  };

  const diff = difficultyLabel[question.difficulty];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 sm:px-6 py-3 border-b border-indigo-100 dark:border-indigo-800">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            問題 {questionNumber} / {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${diff.style}`}>
              {diff.text}
            </span>
            <span className="text-xs text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-800 px-2 py-1 rounded-full truncate max-w-[160px]">
              {question.category}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-5 sm:mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-2.5 sm:space-y-3">
          {question.options.map((option, index) => {
            let style = "border-gray-200 dark:border-gray-600";
            if (!answered) {
              style += " hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 active:bg-indigo-100 dark:active:bg-indigo-900/30";
            } else if (index === question.correctIndex) {
              style = "border-green-500 bg-green-50 dark:bg-green-900/30";
            } else if (index === selectedIndex) {
              style = "border-red-500 bg-red-50 dark:bg-red-900/30";
            } else {
              style = "border-gray-200 dark:border-gray-700 opacity-50";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={answered}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all flex gap-3 min-h-[48px] ${style} ${
                  !answered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span className="font-medium text-gray-400 dark:text-gray-500 shrink-0 w-6">
                  {["A", "B", "C", "D"][index]}.
                </span>
                <span className={`flex-1 ${
                  answered && index === question.correctIndex
                    ? "text-green-800 dark:text-green-200"
                    : answered && index === selectedIndex
                    ? "text-red-800 dark:text-red-200"
                    : "text-gray-800 dark:text-gray-200"
                }`}>{option}</span>
                {answered && index === question.correctIndex && (
                  <span className="shrink-0 text-green-600 dark:text-green-400 font-bold" aria-label="正解">&#10003;</span>
                )}
                {answered && index === selectedIndex && index !== question.correctIndex && (
                  <span className="shrink-0 text-red-600 dark:text-red-400 font-bold" aria-label="不正解">&#10007;</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
            <div
              className={`p-4 rounded-lg ${
                selectedIndex === question.correctIndex
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <p className="font-medium mb-1 text-gray-900 dark:text-gray-100">
                {selectedIndex === question.correctIndex
                  ? "正解!"
                  : "不正解..."}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{question.explanation}</p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">間違えやすいポイント</p>
              <p className="text-sm text-amber-800 dark:text-amber-200">{question.pitfall}</p>
            </div>

            {question.relatedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {question.relatedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 active:bg-indigo-800 active:scale-[0.98] transition-all min-h-[48px]"
            >
              {isLast ? "結果を見る" : "次の問題へ"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
