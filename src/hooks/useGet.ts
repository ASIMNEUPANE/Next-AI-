import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import API from "../lib/API";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";

const useGet = () => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  const fetchMutation = async (qkey: string, fetchUrl: string) => {
    setIsPending(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      const response = await API.get(fetchUrl);
      console.log(response.data, "useGet");
      setData(response.data);
      queryClient.setQueryData([qkey], response.data);
      setIsSuccess(true);
      return response.data;
    } catch (err) {
      console.log(err);
      const axiosError = err as AxiosError<ApiResponse>;
      setIsError(true);
      return setError(axiosError.response?.data.message ?? "Error with axios");
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
