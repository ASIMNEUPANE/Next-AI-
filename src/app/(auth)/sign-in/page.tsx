"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username, 300);
  console.log(debouncedUsername, "debouncedUsername");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const {
    error,
    data: postData,
    isError,
    isPending: isPostPending,
    isSuccess,
    postMutation,
  } = usePost("user");

  const onSubmit = async (formData: z.infer<typeof signUpSchema>) => {
    await postMutation({ urls: "sign-up", data: formData });

    if (isPostPending) {
      return <div>Pending</div>;
    }
    if (isSuccess) {
      toast({
        title: "Success",
        description: postData.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    }

    if (isError) {
      toast({
        title: "Signup failed",
        description: error?.message,
        variant: "destructive",
      });
      console.log("error in signup of user", error?.message);
    }
  };

  //Fix todo later for error
  // const {
  //   data,
  //   fetchMutation,
  //   error: getErr,
  //   isError: getIsErr,
  //   isPending,
  // } = useGet();

  // useEffect(() => {
  //   const checkUsernameUnique = async () => {
  //     if (debouncedUsername) {
  //       setIsCheckingUsername(true);
  //       await fetchMutation(
  //         "checkusername",
  //         `check-username-unique?username=${debouncedUsername}`,
  //       );
  //       setIsCheckingUsername(false);

  //       if (getErr) {
  //         toast({
  //           title: "Error",
  //           description: getErr,
  //           variant: "destructive",
  //         });
  //       }
  //     }
  //   };
  //   checkUsernameUnique();
  // }, [debouncedUsername, fetchMutation, getErr, toast]);

  // useEffect(() => {
  //   if (data) {
  //     setUsernameMessage(data?.message);
  //   }
  // }, [data]);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}1`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  console.log(usernameMessage, "usernameMessage");
  console.log(username);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("email")} type="text" placeholder="email" />
            <input
              {...register("username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="username"
            />
            <input
              {...register("password")}
              type="password"
              placeholder="password"
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
