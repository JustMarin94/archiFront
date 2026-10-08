import { useQuery } from "@tanstack/react-query";
import { getWorks } from "../../../api/works";

export function useWorks() {
  return useQuery({
    queryKey: ["works"],
    queryFn: getWorks,
    select: (data) => data || [],
  });
}
