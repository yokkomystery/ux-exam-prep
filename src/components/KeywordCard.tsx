"use client";

import { useState } from "react";
import { Keyword } from "@/lib/types";

type KeywordCardProps = {
  keyword: Keyword;
  isLearned: boolean;
  onToggleLearned: (id: string) => void;
};

export function KeywordCard({
  keyword,
  isLearned,
  onToggleLearned,
}: KeywordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isFlipped}
      aria-label={`${keyword.term}: ${isFlipped ? "解説を非表示にする" : "解説を表示する"}`}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        isLearned
          ? "border-green-300 dark:border-green-700 bg-green-50/30 dark:bg-green-900/10"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
            {keyword.subcategory}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLearned(keyword.id);
            }}
            className={`text-xs px-3 py-1.5 min-h-[36px] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isLearned
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {isLearned ? "覚えた" : "未学習"}
          </button>
        </div>

        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">
          {keyword.term}
        </h4>

        {isFlipped ? (
          <div className="space-y-2 animate-in fade-in duration-200">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {keyword.description}
            </p>
            {keyword.relatedTerms && keyword.relatedTerms.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {keyword.relatedTerms.map((term) => (
                  <span
                    key={term}
                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded"
                  >
                    {term}
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">タップで閉じる</p>
          </div>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            タップで解説を表示
          </p>
        )}
      </div>
    </div>
  );
}
