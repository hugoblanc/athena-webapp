export interface QaSource {
  contentId: string;
  mediaKey: string;
  title: string;
  url: string;
  relevanceScore?: number;
  publishedAt?: string;
}

export interface QaResponse {
  id?: string;
  question: string;
  answer: string;
  sources: QaSource[];
  timestamp: Date;
}

export interface QaHistoryItem {
  id: string;
  question: string;
  answer: string;
  sources: QaSource[];
  createdAt: Date;
}
