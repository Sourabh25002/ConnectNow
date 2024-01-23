export interface posts {
  post_id: number;
  user_id: number;
  media_link?: string;
  content?: string;
  likes_count?: number;
  comments_count?: number;
  created_at: Date;
}
