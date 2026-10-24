import { ImageResponse } from "next/og";
// Default social sharing image for pages without their own.
export const alt = "Anchorship: offshore vessel charter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpengraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#071B2C", color: "#fff", backgroundImage: "linear-gradient(rgba(86,209,203,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(86,209,203,.08) 1px, transparent 1px)", backgroundSize: "48px 48px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", width: 64, height: 64, border: "2px solid rgba(255,255,255,.3)", borderRadius: 6, alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800 }}>A<span style={{ color: "#22A6A1" }}>.</span></div>
        <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6 }}>ANCHORSHIP</span><span style={{ fontSize: 16, letterSpacing: 5, color: "#B8C7D3" }}>MARINE &amp; OFFSHORE</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, textTransform: "uppercase" }}>Offshore vessels.</span>
        <span style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, textTransform: "uppercase", color: "#56D1CB" }}>Ready for your next operation.</span>
      </div>
      <div style={{ display: "flex", height: 4, width: 160, background: "#22A6A1" }} />
    </div>,
    size,
  );
}
