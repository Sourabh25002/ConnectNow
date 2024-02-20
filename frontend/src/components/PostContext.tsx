// import { create } from "domain";
import { createContext, useContext } from "react";

export interface posts {
  post_id: number;
  user_id: number;
  media_link: string;
  content: string;
  likes_count?: number;
  comments_count?: number;
  created_at: Date;
}

export const PostContext = createContext<posts | undefined>(undefined);

export function usePostContext() {
  const posts = useContext(PostContext);

  if (posts === undefined) {
    throw new Error("usePostContext must be used within the Provider");
  }

  return posts;
}
