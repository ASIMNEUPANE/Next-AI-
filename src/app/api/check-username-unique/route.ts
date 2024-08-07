import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { use } from "react";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: Request) {
  await dbConnect();

  try {
    //to get query params
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    console.log(queryParam, "username=======");
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result, "result");
    if (!result.success) {
      //result.error have all the error so i get username errors if there is
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 },
      );
    }
    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Username is unique",
        },
        { status: 200 },
      );
    }
  } catch (err) {
    console.error("Error checking username", err);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 },
    );
  }
}
