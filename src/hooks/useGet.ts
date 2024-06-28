import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import API from "../lib/API";

const useGet = (qkey: string, initialUrl: string) => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchMutation = async (qkey: string, fetchUrl: string) => {
    setIsPending(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      const response = await API.get(fetchUrl);
      setData(response.data);
      queryClient.setQueryData([qkey], response.data);
      setIsSuccess(true);
      return response.data;
    } catch (err) {
      setError(err);
      setIsError(true);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    data,
    error,
    isPending,
    isSuccess,
    isError,
    fetchMutation,
  };
};

export default useGet;
