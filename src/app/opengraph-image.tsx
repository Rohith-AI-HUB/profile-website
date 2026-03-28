import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/logo-mark";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(160deg, rgba(255,248,239,1) 0%, rgba(250,236,220,1) 52%, rgba(245,226,208,1) 100%)",
          color: "#241612",
          padding: "64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid rgba(168, 98, 57, 0.18)",
            borderRadius: "40px",
            padding: "48px",
            background: "rgba(255, 251, 246, 0.82)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <LogoMark
              style={{
                width: "72px",
                height: "72px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "16px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#766759",
                }}
              >
                Build Ledger
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 600,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Rohith B
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
              maxWidth: "860px",
            }}
          >
            <div
              style={{
                fontSize: "76px",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                fontWeight: 700,
              }}
            >
              Full-stack products and AI workflows with public proof.
            </div>
            <div
              style={{
                fontSize: "28px",
                lineHeight: 1.4,
                color: "#5e5044",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Selected projects, repository evidence, and live builds from a
              focused public portfolio.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              fontFamily: "Arial, sans-serif",
              fontSize: "20px",
              color: "#5e5044",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(168, 98, 57, 0.18)",
              }}
            >
              Product Engineering
            </div>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(168, 98, 57, 0.18)",
              }}
            >
              AI Systems
            </div>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(168, 98, 57, 0.18)",
              }}
            >
              Practical Tools
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
