export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  exampleSentence?: string;
  phonetic?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
  partOfSpeech?: string;
  contextExamples?: string[];
  relatedWords?: string[];
  courseId?: string;
}

export interface VocabularySet {
  id: string;
  name: string;
  description?: string;
  language: string;
  itemCount: number;
  items?: VocabularyItem[];
  courseId?: string;
  category?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdAt?: string;
  updatedAt?: string;
}

export interface VocabularyProgress {
  userId: string;
  setId: string;
  itemsLearned: number;
  totalItems: number;
  averageConfidence: number;
  lastReviewedAt: string;
}

export interface KnowledgeHub {
  id: string;
  type: 'idioms' | 'techniques' | 'grammar' | 'writing_tips';
  title: string;
  content: string;
  category: string;
  examples: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  courseId?: string;
}

export interface StudySession {
  setId: string;
  userId: string;
  startedAt: string;
  itemsStudied: number;
  correctAnswers: number;
}
