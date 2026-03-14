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
    return {
      ...progress,
      quiz: {
        ...progress.quiz,
        everWrongQuestions: Object.entries(progress.quiz.answeredQuestions)
          .filter(([, v]) => !v.correct)
          .map(([id]) => id),
      },
    };
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
  const everWrongQuestions =
    !correct && !progress.quiz.everWrongQuestions.includes(questionId)
      ? [...progress.quiz.everWrongQuestions, questionId]
      : progress.quiz.everWrongQuestions;

  const nextProgress: Progress = {
    ...progress,
    quiz: {
      ...progress.quiz,
      answeredQuestions: {
        ...progress.quiz.answeredQuestions,
        [questionId]: {
          correct,
          answeredAt: Date.now(),
        },
      },
      everWrongQuestions,
    },
  };
  saveProgress(nextProgress);
  return nextProgress;
}

export function toggleBookmarkQuestion(questionId: string): Progress {
  const progress = getProgress();
  const bookmarkedQuestions = progress.quiz.bookmarkedQuestions.includes(questionId)
    ? progress.quiz.bookmarkedQuestions.filter((id) => id !== questionId)
    : [...progress.quiz.bookmarkedQuestions, questionId];

  const nextProgress: Progress = {
    ...progress,
    quiz: {
      ...progress.quiz,
      bookmarkedQuestions,
    },
  };
  saveProgress(nextProgress);
  return nextProgress;
}

export function toggleLearnedKeyword(keywordId: string): Progress {
  const progress = getProgress();
  const learnedKeywords = progress.keywords.learnedKeywords.includes(keywordId)
    ? progress.keywords.learnedKeywords.filter((id) => id !== keywordId)
    : [...progress.keywords.learnedKeywords, keywordId];

  const nextProgress: Progress = {
    ...progress,
    keywords: {
      ...progress.keywords,
      learnedKeywords,
    },
  };
  saveProgress(nextProgress);
  return nextProgress;
}

export function toggleBookmarkKeyword(keywordId: string): Progress {
  const progress = getProgress();
  const bookmarkedKeywords = progress.keywords.bookmarkedKeywords.includes(keywordId)
    ? progress.keywords.bookmarkedKeywords.filter((id) => id !== keywordId)
    : [...progress.keywords.bookmarkedKeywords, keywordId];

  const nextProgress: Progress = {
    ...progress,
    keywords: {
      ...progress.keywords,
      bookmarkedKeywords,
    },
  };
  saveProgress(nextProgress);
  return nextProgress;
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
