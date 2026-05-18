import { NextResponse } from "next/server";

const NGROK_API_URL =
  process.env.NGROK_API_URL || "https://annie-plushed-mayme.ngrok-free.dev";

export async function GET() {
  try {
    const upstream = await fetch(`${NGROK_API_URL}/`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return new NextResponse(text, {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return NextResponse.json(
      {
        status: upstream.ok ? "ok" : "error",
        message: "Ngrok upstream reachable",
      },
      { status: upstream.ok ? 200 : upstream.status },
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error?.message || "Health check failed" },
      { status: 500 },
    );
  }
}
