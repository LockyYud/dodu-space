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
        background: "#050816",
        color: "white",
        padding: "64px",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 600, maxWidth: "80%" }}>
        {title}
      </div>
      <div style={{ fontSize: 24, opacity: 0.7 }}>{siteConfig.title}</div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
