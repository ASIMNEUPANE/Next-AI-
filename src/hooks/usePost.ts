import API from "@/lib/API";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const usePost = (qkey?: string) => {
  const queryClient = useQueryClient();

  const {
    mutate: postMutation,
    isError,
    isPending,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await API.post(payload.urls, { ...payload.data });
      return data;
    },
    onError(error) {},
    onSuccess: async () => {
      if (qkey) {
        queryClient.invalidateQueries({ queryKey: [qkey] });
      }
    },
  });
  return {
    postMutation,
    error,
    data,
    isError,
    isSuccess,
    isPending,
  };
};

export default usePost;
