"use client";

import { useState, useEffect, useCallback } from "react";
import { Progress } from "@/lib/types";
import {
  getProgress,
  recordQuizAnswer,
  toggleLearnedKeyword,
  toggleBookmarkQuestion,
  toggleBookmarkKeyword,
  resetProgress,
} from "@/lib/storage";

const defaultProgress: Progress = {
  quiz: { answeredQuestions: {}, bookmarkedQuestions: [] },
  keywords: { learnedKeywords: [], bookmarkedKeywords: [] },
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setIsLoaded(true);
  }, []);

  const answerQuestion = useCallback(
    (questionId: string, correct: boolean) => {
      const updated = recordQuizAnswer(questionId, correct);
      setProgress({ ...updated });
    },
    []
  );

  const toggleQuestionBookmark = useCallback((questionId: string) => {
    const updated = toggleBookmarkQuestion(questionId);
    setProgress({ ...updated });
  }, []);

  const toggleKeywordLearned = useCallback((keywordId: string) => {
    const updated = toggleLearnedKeyword(keywordId);
    setProgress({ ...updated });
  }, []);

  const toggleKeywordBookmark = useCallback((keywordId: string) => {
    const updated = toggleBookmarkKeyword(keywordId);
    setProgress({ ...updated });
  }, []);

  const reset = useCallback(() => {
    resetProgress();
    setProgress(defaultProgress);
  }, []);

  return {
    progress,
    isLoaded,
    answerQuestion,
    toggleQuestionBookmark,
    toggleKeywordLearned,
    toggleKeywordBookmark,
    reset,
  };
}
