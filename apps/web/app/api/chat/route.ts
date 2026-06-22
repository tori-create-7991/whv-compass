import { NextResponse, type NextRequest } from "next/server";

/**
 * Same-origin proxy to the API (Cloud Run). Keeps the backend URL server-side and
 * avoids CORS. The browser never sees API credentials.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const base = process.env.API_BASE_URL ?? "http://localhost:8080";
  const body = await req.text();
  try {
    const upstream = await fetch(`${base}/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    const data = await upstream.text();
    return new NextResponse(data, {
      status: upstream.status,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "api_unreachable" }, { status: 502 });
  }
}
