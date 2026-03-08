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
      className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
        isLearned ? "border-green-300 bg-green-50/30" : "border-gray-200"
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            {keyword.subcategory}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLearned(keyword.id);
            }}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              isLearned
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {isLearned ? "覚えた" : "未学習"}
          </button>
        </div>

        <h4 className="font-bold text-gray-900 text-lg mb-2">
          {keyword.term}
        </h4>

        {isFlipped ? (
          <div className="space-y-2">
            <p className="text-gray-700 text-sm leading-relaxed">
              {keyword.description}
            </p>
            {keyword.relatedTerms && keyword.relatedTerms.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {keyword.relatedTerms.map((term) => (
                  <span
                    key={term}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                  >
                    {term}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            タップで解説を表示
          </p>
        )}
      </div>
    </div>
  );
}
