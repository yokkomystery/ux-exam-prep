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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-50 px-6 py-3 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-700">
            問題 {questionNumber} / {totalQuestions}
          </span>
          <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full">
            {question.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let style = "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
            if (answered) {
              if (index === question.correctIndex) {
                style = "border-green-500 bg-green-50 text-green-800";
              } else if (index === selectedIndex) {
                style = "border-red-500 bg-red-50 text-red-800";
              } else {
                style = "border-gray-200 opacity-50";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${style} ${
                  !answered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span className="font-medium text-gray-400 mr-3">
                  {["A", "B", "C", "D"][index]}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-6">
            <div
              className={`p-4 rounded-lg ${
                selectedIndex === question.correctIndex
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p className="font-medium mb-1">
                {selectedIndex === question.correctIndex
                  ? "正解!"
                  : "不正解..."}
              </p>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {isLast ? "結果を見る" : "次の問題へ"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
