import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    //Gets the unencoded version of an encoded component of a Uniform Resource Identifier (URI).
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 },
      );
    }
    const isCodeValid = user.verifyCode == code;
    //check if the database date is higher than the current date
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, Please signup again to get a new code",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code",
        },
        { status: 400 },
      );
    }
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        success: false,
        message: "Error checking verification code",
      },
      { status: 500 },
    );
  }
}
