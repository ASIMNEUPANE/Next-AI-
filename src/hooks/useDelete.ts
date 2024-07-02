import API from "@/lib/API";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const useDelete = (qkey?: string) => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteMutation,
    isError,
    isPending,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await API.delete(payload.urls);
      return data;
    },
    // onError(error) {
    //   data.message
    // },
    onSuccess: async () => {
      if (qkey) {
        queryClient.invalidateQueries({ queryKey: [qkey] });
      }
    },
  });
  return {
    deleteMutation,
    error,
    data,
    isError,
    isSuccess,
    isPending,
  };
};

export default useDelete;
