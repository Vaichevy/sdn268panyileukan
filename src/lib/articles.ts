import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ArticleItem = {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  cover_url: string | null;
  pdf_url: string | null;
  author: string | null;
  is_public: boolean;
  published_at: string;
  created_at: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const articlesTable = () => (supabase as any).from("article_items");

export const articlesQuery = {
  queryKey: ["article_items"],
  queryFn: async () => {
    const { data, error } = await articlesTable()
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ArticleItem[];
  },
};

export function useArticles() {
  return useQuery(articlesQuery);
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ["article_items", id],
    queryFn: async () => {
      const { data, error } = await articlesTable().select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as ArticleItem | null;
    },
  });
}
