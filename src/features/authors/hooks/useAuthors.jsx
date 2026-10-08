import { useQuery } from "@tanstack/react-query";
import { getAuthors } from "../../../api/authors";

export function useAuthors() {
  return useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
    select: (data) => data || [],
  });
}
