import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

import { siteConfig } from "@/config/site";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? siteConfig.title;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        background: "#f4efe6",
        color: "#1e1a14",
        padding: "64px",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ fontSize: 44, fontWeight: 400, maxWidth: "85%" }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 1, background: "#1e1a14", width: "100%" }} />
        <div style={{ fontSize: 22, color: "#6b6259" }}>{siteConfig.title}</div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
