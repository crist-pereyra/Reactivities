export interface ChatComment {
  id: string;
  createdAt: Date;
  body: string;
  userId: string;
  displayName: string;
  imageUrl?: string;
}
