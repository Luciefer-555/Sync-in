import { NextResponse } from "next/server";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";

export const runtime = "nodejs";

const verifySchema = z.object({
  email: z.string().email("A valid college email is required"),
  code: z.string().length(6, "Recovery code must be 6 digits"),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parseResult = verifySchema.safeParse(payload);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, error: issue?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { email, code } = parseResult.data;
    const normalizedEmail = email.toLowerCase();

    await connectToDatabase();

    const user = await User.findOne({
      email: normalizedEmail,
      credentialRecoveryCode: code,
      credentialRecoveryExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired recovery code." },
        { status: 400 },
      );
    }

    const responsePayload = {
      success: true,
      message: "Recovery successful.",
      credentials: {
        profileId: user.profileId,
        collegeId: user.collegeId,
        username: user.username,
      },
    };

    user.credentialRecoveryCode = null;
    user.credentialRecoveryExpires = null;
    await user.save();

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error verifying credential recovery code:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
