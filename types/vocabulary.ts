export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  exampleSentence?: string;
  phonetic?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
}

export interface VocabularySet {
  id: string;
  name: string;
  description?: string;
  language: string;
  itemCount: number;
  items?: VocabularyItem[];
}

export interface StudySession {
  setId: string;
  userId: string;
  startedAt: string;
  itemsStudied: number;
  correctAnswers: number;
}
