import { NextResponse } from "next/server";
import { scrapeWebsite } from "../../../../lib/scraper";

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, selector } = body || {};

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    const data = await scrapeWebsite(url, selector);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
