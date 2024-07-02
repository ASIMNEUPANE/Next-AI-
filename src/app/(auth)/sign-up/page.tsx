"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import usePost from "@/hooks/usePost";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import useGet from "@/hooks/useGet";
import { signIn } from "next-auth/react";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const form = useForm<z.infer<typeof signUpSchema>>({
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
    await signIn("credentials");
  };
  useEffect(() => {
    if (postData?.success) {
      toast({
        title: "Success",
        description: postData?.message,
      });
      router.replace(`/verify/${username}`);
    } else if (error) {
      toast({
        title: "Signup failed",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
      console.log("error in signup of user", error?.message);
    }
  }, [postData, error]);

  //   Fix todo later for error
  // const {
  //   data,
  //   fetchMutation,
  //   error: getErr,
  //   isError: getIsErr,
  //   isPending,
  // } = useGet();

  // useEffect(() => {
  //   const checkUsernameUnique = async () => {
  //     if (username) {
  //       setIsCheckingUsername(true);
  //       const resp = await fetchMutation(
  //         "checkusername",
  //         `check-username-unique?username=${username}`,
  //       );
  //       console.log("page fetch", resp?.message);
  //       if (data) {
  //         const msg = data.message as string;
  //         setUsernameMessage(msg);
  //       }
  //       if (getErr) {
  //         setUsernameMessage(getErr);
  //         setUsernameMessage("")
  //       }
  //     }

  //     setIsCheckingUsername(false);
  //   };
  //   checkUsernameUnique();
  // }, [username]);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          console.log(response.data.message);
          setUsernameMessage(response.data.message);
          setIsCheckingUsername(false);
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
  }, [username]);
  console.log(usernameMessage, "pagheswala");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>

                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || isPostPending}>
              {isSubmitting || isPostPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?
            <Link
              href={"/sign-in"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
