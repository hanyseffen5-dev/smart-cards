import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useToggleFavorite,
  getGetFavoritesQueryKey,
  type GetFavoritesResponse,
  type ToggleFavoriteResponse,
} from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";

function applyFavoriteResponse(
  list: GetFavoritesResponse,
  response: ToggleFavoriteResponse,
): GetFavoritesResponse {
  if (response.isFavorite) {
    if (list.some((f) => f.wordId === response.wordId)) return list;
    return [
      ...list,
      {
        id: -1,
        studentId: response.studentId,
        wordId: response.wordId,
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return list.filter((f) => f.wordId !== response.wordId);
}

export function useFavoriteToggle(studentId: number | undefined | null) {
  const queryClient = useQueryClient();
  const studentIdRef = useRef(studentId);
  studentIdRef.current = studentId;

  const toggleFavorite = useToggleFavorite({
    mutation: {
      onMutate: async ({ data }) => {
        const sid = studentIdRef.current;
        if (!sid) return;
        const queryKey = getGetFavoritesQueryKey({ studentId: sid });
        await queryClient.cancelQueries({ queryKey });
        const previous = queryClient.getQueryData<GetFavoritesResponse>(queryKey);
        queryClient.setQueryData<GetFavoritesResponse>(queryKey, (old) => {
          const list = old ?? [];
          const exists = list.some((f) => f.wordId === data.wordId);
          if (exists) {
            return list.filter((f) => f.wordId !== data.wordId);
          }
          return [
            ...list,
            {
              id: -Date.now(),
              studentId: sid,
              wordId: data.wordId,
              createdAt: new Date().toISOString(),
            },
          ];
        });
        return { previous, queryKey };
      },
      onSuccess: (response) => {
        const sid = studentIdRef.current;
        if (!sid) return;
        const queryKey = getGetFavoritesQueryKey({ studentId: sid });
        queryClient.setQueryData<GetFavoritesResponse>(queryKey, (old) =>
          applyFavoriteResponse(old ?? [], response),
        );
      },
      onError: (error, _vars, context) => {
        if (context?.queryKey && context.previous) {
          queryClient.setQueryData(context.queryKey, context.previous);
        }
        const message =
          error instanceof Error && error.message
            ? error.message
            : "تعذّر حفظ المفضلة. أعد تشغيل السيرفر (pnpm dev).";
        toast({
          variant: "destructive",
          title: "المفضلة",
          description: message,
        });
      },
    },
  });

  const toggle = useCallback(
    (wordId: number) => {
      const sid = studentIdRef.current;
      if (!sid || toggleFavorite.isPending) return;
      toggleFavorite.mutate({ data: { studentId: sid, wordId } });
    },
    [toggleFavorite],
  );

  return { toggle, isPending: toggleFavorite.isPending };
}
