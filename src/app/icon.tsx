import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/site-config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: SITE_CONFIG.themeColor,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 800,
          borderRadius: 6,
        }}
      >
        T
      </div>
    ),
    { ...size }
  );
}
