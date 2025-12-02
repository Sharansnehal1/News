
  export interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: {
    url: string;
  }[];
  content: {
    children: {
      text: string;
    }[];
  }[];
}
