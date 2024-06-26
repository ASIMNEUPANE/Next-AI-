import { useQuery } from "@tanstack/react-query";
import API from "../lib/API";

const useGet = (qkey: string, urls: string) => {
  const { isError, isLoading, data, error } = useQuery({
    queryKey: [qkey],
    queryFn: async () => {
      const { data } = await API.get(`${urls}`);

      return data;
    },
  });
  return { isError, isLoading, data, error };
};

export default useGet;
