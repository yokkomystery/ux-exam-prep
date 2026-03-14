"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getProgress,
  recordQuizAnswer,
  toggleLearnedKeyword,
  toggleBookmarkQuestion,
  toggleBookmarkKeyword,
  resetProgress,
} from "@/lib/storage";

const defaultProgress: Progress = {
  quiz: { answeredQuestions: {}, bookmarkedQuestions: [], everWrongQuestions: [] },
  keywords: { learnedKeywords: [], bookmarkedKeywords: [] },
};

function subscribeToProgress(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleProgressChange = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "ux-exam-progress") {
      onStoreChange();
    }
  };

  window.addEventListener("ux-exam-progress-change", handleProgressChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("ux-exam-progress-change", handleProgressChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useProgress() {
  const progress = useSyncExternalStore(
    subscribeToProgress,
    getProgress,
    () => defaultProgress
  );

  const answerQuestion = useCallback(
    (questionId: string, correct: boolean) => {
      recordQuizAnswer(questionId, correct);
    },
    []
  );

  const toggleQuestionBookmark = useCallback((questionId: string) => {
    toggleBookmarkQuestion(questionId);
  }, []);

  const toggleKeywordLearned = useCallback((keywordId: string) => {
    toggleLearnedKeyword(keywordId);
  }, []);

  const toggleKeywordBookmark = useCallback((keywordId: string) => {
    toggleBookmarkKeyword(keywordId);
  }, []);

  const reset = useCallback(() => {
    resetProgress();
  }, []);

  return {
    progress,
    isLoaded: true,
    answerQuestion,
    toggleQuestionBookmark,
    toggleKeywordLearned,
    toggleKeywordBookmark,
    reset,
  };
}
