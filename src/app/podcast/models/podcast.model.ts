export interface Podcast {
  id: number;
  contentId: number;
  dialogueText: string;
  audioUrl: string;
  duration: number | null;
  status: string;
  errorMessage: string | null;
  createdAt: Date;
  content: {
    id: number;
    contentId: string;
    title: string;
    contentType: string;
    description: string;
    plainText: string | null;
    publishedAt: Date;
    metaMediaId: number | null;
    imageId: number | null;
    audioId: number | null;
    meta_media: {
      id: number;
      key: string;
      title: string;
      logo: string;
    };
  };
}
