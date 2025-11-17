// src/components/Articles/types.ts
export interface Article {
  id: number;
  documentId: string;
  title: string;
  content: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: ArticleImage[];
}

export interface ContentBlock {
  type: string;
  children: ContentChild[];
}

export interface ContentChild {
  type: string;
  text: string;
}

export interface ArticleImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: any;
    [key: string]: any;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
