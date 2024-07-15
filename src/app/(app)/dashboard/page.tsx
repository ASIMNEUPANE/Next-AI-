// "use client";
// import MessageCard from "@/components/MessageCard";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
// import { useToast } from "@/components/ui/use-toast";
// import useGet from "@/hooks/useGet";
// import usePost from "@/hooks/usePost";
// import { Message } from "@/model/User";
// import { AccpetMessageSchema } from "@/schemas/acceptMessageSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2, RefreshCcw } from "lucide-react";
// import { User } from "next-auth";
// import { useSession } from "next-auth/react";
// import React, { useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// function Page() {
//   //optimestic ui means update in ui but will update server calmly
//   const [acceptMessages, setAcceptMessages] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false);
//   const { toast } = useToast();
//   const handleDeleteMessage = (messageId: string) => {
//     setMessages(messages.filter((message) => message._id !== messageId));
//   };
//   const { data: session } = useSession();
//   // const { register, watch, setValue } = useForm({
//   //   resolver: zodResolver(AccpetMessageSchema),
//   // });
//   // const acceptMessages = watch("acceptMessages");
//   const {
//     data: getData,
//     error,
//     fetchMutation,
//     isError,
//     isPending,
//     isSuccess,
//   } = useGet();
//   const {
//     data: getAcceptMessageData,
//     // error,
//     fetchMutation: fetchGetAcceptMessageData,
//     // isError,
//     // isPending,
//     // isSuccess,
//   } = useGet();
//   const {
//     data: postData,
//     postMutation,
//     isPending: postPending,
//     error: postError,
//   } = usePost("get-messages");

//   const fetchAcceptMessage = useCallback(async () => {
//     const resp = await fetchGetAcceptMessageData(
//       "accept-message",
//       "/accept-messages",
//     );
//     setAcceptMessages(resp?.data?.data?.isAcceptingMessage);
//   }, [acceptMessages]);

//   const fetchMessages = useCallback(
//     async (refresh: boolean = false) => {
//       const resp = await fetchMutation("get-messages", "/get-messages");
//       setMessages(resp?.data?.data?.messages || []);
//       if (refresh) {
//         toast({
//           title: "Refresh messages",
//           //@ts-ignore
//           description: "Showing latest messages",
//         });
//       }
//     },
//     [setMessages],
//   );
//   useEffect(() => {
//     if (!session || !session.user) return;
//     fetchMessages();
//     fetchAcceptMessage();
//   }, [session, , fetchAcceptMessage, fetchMessages]);

//   //handle switch change
//   const handleSwitchChange = async () => {
//     console.log('clikc')
//     postMutation({
//       urls: "/accept-messages",
//       data: { acceptMessages: !acceptMessages },
//     });
//     console.log(postData?.isAcceptingMessage);
//     setAcceptMessages(postData?.isAcceptingMessage);
//   };

//   //error success handling
//   useEffect(() => {
//     if (postData) {
//       toast({
//         title: postData.data.message,
//         variant: "default",
//       });
//     } else if (postError) {
//       toast({
//         title: "Not accepting messages",
//         //@ts-ignore
//         description:
//           postError?.response?.data?.message ||
//           "Failed to fetch message settings",
//         variant: "destructive",
//       });
//     }
//     if (getData) {
//       toast({
//         title: "Accepting messages",
//         description: getData?.message,
//       });
//     } else if (error) {
//       toast({
//         title: "Not accepting messages",
//         //@ts-ignore
//         description:
//           error?.response?.data?.message || "Failed to fetch message settings",
//         variant: "destructive",
//       });
//     }
//   }, [getData, error, postData, postError]);

//   //todo: research

//   if (!session || !session.user) {
//     return <div>Please login</div>;
//   }
//   const { username } = session?.user as User;
//   const baseUrl = `${window.location.protocol}//${window.location.host}`;
//   const profileUrl = `${baseUrl}/u/${username}`;

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(profileUrl);
//     toast({
//       title: "URL copied",
//       description: "Profile URL has been copied to clipboard",
//     });
//   };

//   return (
//     <div className="my-8 mx-4 md:mx-8 lg-mx-auto bg-white rounded w-full max-w-6xl">
//       <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
//       <div className="mb-4">
//         <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={profileUrl}
//             disabled
//             className="input input-bordered w-full p-2 mr-2"
//           />
//           <Button onClick={copyToClipboard}>Copy</Button>
//         </div>
//       </div>
//       <div className="mb-4">
//         {/* <Switch
//           checked={acceptMessages}
//           onCheckedChange={handleSwitchChange}

//           value={acceptMessages}
//           disabled={postPending}
//         /> */}
//         <label className="inline-flex relative items-center cursor-pointer">
//           <input type="checkbox" value={acceptMessages} onChange={handleSwitchChange} className="sr-only peer" />
//           <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
//           <span className="ml-3 text-sm font-medium text-gray-900">On</span>
//         </label>
//         <span className="ml-2">
//           Accept Messages :{acceptMessages ? "On" : "Of"}
//         </span>
//       </div>
//       <Separator />
//       <Button
//         className="mt-4"
//         variant={"outline"}
//         onClick={(e) => {
//           e.preventDefault();
//           fetchMessages(true);
//         }}
//       >
//         {isLoading ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <RefreshCcw className="h-4 w-4" />
//         )}
//       </Button>
//       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {messages.length > 0 ? (
//           messages.map((message, index) => (
//             <MessageCard
//               key={message?._id}
//               message={message}
//               onMessageDelete={handleDeleteMessage}
//             />
//           ))
//         ) : (
//           <p>No messages to display</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Page;

"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AccpetMessageSchema } from "../../../schemas/acceptMessageSchema";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AccpetMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response?.data?.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast],
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                // @ts-ignore
                key={message?._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
