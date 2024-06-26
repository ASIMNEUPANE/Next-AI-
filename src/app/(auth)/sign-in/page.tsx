"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
function page() {
  // const { data, isError, isPending, isSuccess, postMutation } = usePost();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username, 300);
  const { toast } = useToast();
  const router = useRouter();

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

  const checkUserNameUnique = async () => {
    if (debouncedUsername) {
      setIsCheckingUsername(true);
      setUsernameMessage("");

      const { data, isError, isLoading, error } = useGet(
        "getUsername",
        `check-user-unique?username=${debouncedUsername}`,
      );
      setUsernameMessage(data.message);
      setIsCheckingUsername(false);

      if (error) {
        setUsernameMessage(error.message);
        setIsCheckingUsername(false);
      }
    }
  };

  useEffect(() => {
    checkUserNameUnique();
  }, [debouncedUsername]);
  return <div>page</div>;
}

export default page;
