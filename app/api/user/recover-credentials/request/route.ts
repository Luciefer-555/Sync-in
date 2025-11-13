import { NextResponse } from "next/server";
import { z } from "zod";
import { randomInt } from "crypto";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";

export const runtime = "nodejs";

const requestSchema = z.object({
  email: z.string().email("A valid college email is required"),
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

    const { email } = parseResult.data;
    const normalizedEmail = email.toLowerCase();

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If that email is registered, an access code has been generated.",
      });
    }

    const recoveryCode = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.credentialRecoveryCode = recoveryCode;
    user.credentialRecoveryExpires = expiresAt;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Recovery code generated. Please check your email.",
      recoveryCode,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error generating credential recovery code:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
