// THis file is to define our types to the next auth user type beacause nextauth doesnot have many atrributes like our custom

import nextAuth from "next-auth";
//we use declare to modify the existing type
declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
}
