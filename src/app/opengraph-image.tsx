import { ImageResponse } from "next/og";
import { COMPANY } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#08300a",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#fdda7e",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Indonesian Export & Import Partner
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, marginTop: 24, maxWidth: 900 }}>
          {COMPANY.legalName}
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 24, color: "#dedcd4", maxWidth: 820 }}>
          Sourcing, quality coordination, export documentation, and logistics support for
          international buyers.
        </div>
      </div>
    ),
    { ...size }
  );
}
