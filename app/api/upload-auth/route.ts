import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get ImageKit credentials from environment variables
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      console.error("Missing ImageKit credentials in environment variables");
      return NextResponse.json(
        { error: "ImageKit credentials not configured" },
        { status: 500 }
      );
    }

    // Generate authentication parameters
    const token = crypto.randomBytes(16).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error("Upload authentication error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload credentials" },
      { status: 500 }
    );
  }
}
