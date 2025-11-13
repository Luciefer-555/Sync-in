import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";

export const runtime = "nodejs";

const requestSchema = z.object({
  email: z.string().email("A valid college email is required"),
  profileId: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parseResult = requestSchema.safeParse(payload);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, error: issue?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { email, profileId } = parseResult.data;
    const normalizedEmail = email.toLowerCase();

    await connectToDatabase();

    const user = await User.findOne(
      profileId
        ? { email: normalizedEmail, profileId }
        : { email: normalizedEmail },
    );

    if (!user) {
      // Do not reveal which emails exist
      return NextResponse.json({ success: true, message: "If an account exists, password reset instructions have been generated." });
    }

    const resetToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = expiresAt;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset link generated. Please check your email.",
      resetToken,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error handling forgot password request:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
