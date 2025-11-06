// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";

// Force this route to be dynamic so Next/Vercel don't cache the response
export const dynamic = "force-dynamic";

export async function GET() {
  // Your application logic to authenticate the user
  // For example, you can check if the user is logged in or has the necessary permissions
  // If the user is not authenticated, you can return an error response

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return Response.json(
      {
        error:
          "ImageKit credentials not configured. Please check your environment variables.",
      },
      { status: 500 }
    );
  }

  // Use the ImageKit helper to produce token/signature (it may internally generate
  // a correctly-signed token). This keeps the token/signature pair consistent.
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: privateKey,
    publicKey: publicKey,
  });

  // Return response with explicit no-cache/no-store headers to avoid caching of the token
  const headers = {
    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    Pragma: "no-cache",
    "Surrogate-Control": "no-store",
    Vary: "Origin",
  };

  // // Log a short token snippet to the server logs for debugging (safe: not full token)
  // try {
  //   // Print a tiny token preview to help debug production issues without leaking the full token
  //   // These logs appear in your Vercel/hosting logs.
  //   // eslint-disable-next-line no-console
  //   console.log("[upload-auth] token-preview:", token?.slice?.(0, 8));
  // } catch (_) {
  //   /* ignore logging errors */
  // }

  return Response.json({ token, expire, signature, publicKey: publicKey }, { status: 200, headers });
}
