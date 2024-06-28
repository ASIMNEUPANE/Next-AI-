"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect, useState, useCallback } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username, 300);

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
    postMutation({ urls: "sign-up", data: formData });

    if (isPostPending) {
      return <div>Pending</div>;
    }
    if (isSuccess) {
      toast({
        title: "Success",
        description: postData.message,
      });
      router.replace(`/verify/${username}`);
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
  const {
    data,
    fetchMutation,
    error: getErr,
    isError: getIsErr,
    isPending,
  } = useGet("checkusername", `check-username-unique?username=${"asim"}`);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        fetchMutation(
          "checkusername",
          `check-username-unique?username=${"asim"}`,
        );

        setUsernameMessage(data?.message);

        if (getErr) {
          toast({
            title: "Error",
            description: "Error while checking username",
            variant: "destructive",
          });
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center"></div>
      </div>
    </div>
  );
};

export default Page;
