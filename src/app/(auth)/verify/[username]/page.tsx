"use client";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import usePost from "@/hooks/usePost";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const page = () => {
  const {
    data: postData,
    error,
    postMutation,
    isPending,
    isError,
    isSuccess,
  } = usePost();
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    postMutation({ urls: "verify-code", data: { ...data, username } });
  };
  useEffect(() => {
    if (postData?.success) {
      toast({
        title: "Success",
        description: postData?.message,
      });
      router.replace(`/sign-in`);
    } else if (error) {
      toast({
        title: "Signup failed",
        //@ts-ignore
        description: error?.response?.data?.message,
        variant: "destructive",
      });
      console.log("error in signup of user", error?.message);
    }
  }, [postData, error]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account{" "}
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>

          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Code" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
