// THis file is to define our types to the next auth user type beacause nextauth doesnot have many atrributes like our custom

import nextAuth, { DefaultSession } from "next-auth";
//we use declare to modify the existing type
declare module "next-auth" {
  //redefine interface
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
    } & DefaultSession["user"];
  }
}

//another way redefine
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
}
