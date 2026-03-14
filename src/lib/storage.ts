import { Progress } from "./types";

const STORAGE_KEY = "ux-exam-progress";
const STORAGE_EVENT = "ux-exam-progress-change";

const defaultProgress: Progress = {
  quiz: {
    answeredQuestions: {},
    bookmarkedQuestions: [],
    everWrongQuestions: [],
  },
  keywords: {
    learnedKeywords: [],
    bookmarkedKeywords: [],
  },
};

let cachedProgress: Progress = defaultProgress;
let cachedSerializedProgress: string | null = null;

function normalizeProgress(progress: Progress): Progress {
  if (!progress.quiz.everWrongQuestions) {
    progress.quiz.everWrongQuestions = Object.entries(progress.quiz.answeredQuestions)
      .filter(([, v]) => !v.correct)
      .map(([id]) => id);
  }
  return progress;
}

export function getProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      cachedSerializedProgress = null;
      cachedProgress = defaultProgress;
      return cachedProgress;
    }

    if (data === cachedSerializedProgress) {
      return cachedProgress;
    }

    cachedSerializedProgress = data;
    cachedProgress = normalizeProgress(JSON.parse(data) as Progress);
    return cachedProgress;
  } catch {
    cachedSerializedProgress = null;
    cachedProgress = defaultProgress;
    return cachedProgress;
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  cachedProgress = normalizeProgress(progress);
  cachedSerializedProgress = JSON.stringify(cachedProgress);
  localStorage.setItem(STORAGE_KEY, cachedSerializedProgress);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function recordQuizAnswer(
  questionId: string,
  correct: boolean
): Progress {
  const progress = getProgress();
  progress.quiz.answeredQuestions[questionId] = {
    correct,
    answeredAt: Date.now(),
  };
  if (!correct && !progress.quiz.everWrongQuestions.includes(questionId)) {
    progress.quiz.everWrongQuestions.push(questionId);
  }
  saveProgress(progress);
  return progress;
}

export function toggleBookmarkQuestion(questionId: string): Progress {
  const progress = getProgress();
  const idx = progress.quiz.bookmarkedQuestions.indexOf(questionId);
  if (idx >= 0) {
    progress.quiz.bookmarkedQuestions.splice(idx, 1);
  } else {
    progress.quiz.bookmarkedQuestions.push(questionId);
  }
  saveProgress(progress);
  return progress;
}

export function toggleLearnedKeyword(keywordId: string): Progress {
  const progress = getProgress();
  const idx = progress.keywords.learnedKeywords.indexOf(keywordId);
  if (idx >= 0) {
    progress.keywords.learnedKeywords.splice(idx, 1);
  } else {
    progress.keywords.learnedKeywords.push(keywordId);
  }
  saveProgress(progress);
  return progress;
}

export function toggleBookmarkKeyword(keywordId: string): Progress {
  const progress = getProgress();
  const idx = progress.keywords.bookmarkedKeywords.indexOf(keywordId);
  if (idx >= 0) {
    progress.keywords.bookmarkedKeywords.splice(idx, 1);
  } else {
    progress.keywords.bookmarkedKeywords.push(keywordId);
  }
  saveProgress(progress);
  return progress;
}

export function getQuizStats(categoryFilter?: string) {
  const progress = getProgress();
  const entries = Object.entries(progress.quiz.answeredQuestions);
  const filtered = categoryFilter
    ? entries.filter(([id]) => id.startsWith(categoryFilter))
    : entries;
  const total = filtered.length;
  const correct = filtered.filter(([, v]) => v.correct).length;
  return { total, correct, accuracy: total > 0 ? correct / total : 0 };
}

export function getWrongQuestionIds(): string[] {
  const progress = getProgress();
  return Object.entries(progress.quiz.answeredQuestions)
    .filter(([, v]) => !v.correct)
    .map(([id]) => id);
}

export function getEverWrongQuestionIds(): string[] {
  const progress = getProgress();
  return progress.quiz.everWrongQuestions;
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  cachedSerializedProgress = null;
  cachedProgress = defaultProgress;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}
