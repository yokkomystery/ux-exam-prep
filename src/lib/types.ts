export type Difficulty = "basic" | "standard" | "advanced";

export type Question = {
  id: string;
  category: string;
  subcategory: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
  pitfall: string;
  relatedKeywords: string[];
};

export type Keyword = {
  id: string;
  category: string;
  subcategory: string;
  term: string;
  description: string;
  relatedTerms?: string[];
};

export type CategoryInfo = {
  id: string;
  name: string;
  subcategories: string[];
  questionCount: number;
  keywordCount: number;
  importance: number; // 1-3 (★)
};

export type QuizProgress = {
  answeredQuestions: Record<string, QuizAnswerRecord>;
  bookmarkedQuestions: string[];
  everWrongQuestions: string[];
};

export type QuizAnswerRecord = {
  correct: boolean;
  answeredAt: number;
};

export type KeywordProgress = {
  learnedKeywords: string[];
  bookmarkedKeywords: string[];
};

export type Progress = {
  quiz: QuizProgress;
  keywords: KeywordProgress;
};
