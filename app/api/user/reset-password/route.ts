import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";

export const runtime = "nodejs";

const resetSchema = z.object({
  token: z.string().min(10, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long"),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parseResult = resetSchema.safeParse(payload);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, error: issue?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { token, password } = parseResult.data;

    await connectToDatabase();

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "This reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return NextResponse.json({ success: true, message: "Password has been reset. You can now sign in." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
