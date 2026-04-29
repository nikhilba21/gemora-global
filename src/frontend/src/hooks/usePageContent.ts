import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// Normalize backend getContent result: string | null  OR  [] | [string]
function normalize(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") return v[0];
  return "";
}

// Page → field keys mapping
const PAGE_FIELDS: Record<string, string[]> = {
  homepage: ["hero_title", "hero_subtitle", "about_title", "about_text"],
  about: [
    "page_title",
    "story_text",
    "mission_text",
    "about_story",
    "about_export",
  ],
  wholesale: ["page_title", "intro_text", "moq_text", "wholesale_intro"],
  contact: [
    "page_title",
    "address",
    "phone",
    "email",
    "contact_address",
    "contact_phone",
    "contact_email",
  ],
};

/**
 * usePageContent(pageId)
 *
 * Returns:
 *   content       – Record<string, string> – all field values for the page
 *   isLoading     – true while any field is fetching
 *   updateContent – async (key, value) => void – saves one key to backend
 */
export function usePageContent(pageId: string) {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();
  const keys = PAGE_FIELDS[pageId] ?? [];

  // Fetch all keys in parallel via a single query that resolves to a Record
  const { data, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["page-content", pageId],
    queryFn: async () => {
      if (!actor) return {};
      const pairs = await Promise.all(
        keys.map(async (key) => {
          const val = await actor.getContent(key);
          return [key, normalize(val)] as [string, string];
        }),
      );
      return Object.fromEntries(pairs);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: async ({
      key,
      value,
    }: {
      key: string;
      value: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.setContent(key, value);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["page-content", pageId] });
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });

  const updateContent = async (key: string, value: string) => {
    await mutation.mutateAsync({ key, value });
  };

  return {
    content: (data ?? {}) as Record<string, string>,
    isLoading: isLoading || (isFetching && !actor),
    updateContent,
  };
}
