import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/logo-mark";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <LogoMark
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    ),
    size,
  );
}
