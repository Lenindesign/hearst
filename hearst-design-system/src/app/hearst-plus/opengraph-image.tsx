import { ImageResponse } from "next/og";

export const alt = "Hearst+ Live Feed personalized magazine reader preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const leadImage = "https://hips.hearstapps.com/hmg-prod/images/85f7e7dd-f520-4ed8-af64-ecf5224c353c.jpg";
const logoImage = new URL(
  "/logos/hearst-plus.svg",
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hearst-design-system.netlify.app"
).toString();

const utilityText = {
  fontSize: 12,
  fontWeight: 700,
  color: "#FFFFFF",
} as const;

const sectionLabel = {
  display: "flex",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 1.5,
  color: "#2D75B9",
} as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#F4F2EE",
          color: "#121212",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            height: 30,
            padding: "0 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#2D75B9",
          }}
        >
          <div style={{ display: "flex", gap: 16, ...utilityText }}>
            <span>Shop</span>
            <span>Newsletter</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, ...utilityText }}>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 999,
                background: "#FFFFFF",
                color: "#17344E",
              }}
            >
              All
            </span>
            <span>Lifestyle</span>
            <span>Autos</span>
            <span>Fashion &amp; Luxury</span>
            <span>Enthusiast &amp; Wellness</span>
          </div>
          <div
            style={{
              padding: "4px 12px",
              display: "flex",
              borderRadius: 3,
              background: "#FFFFFF",
              color: "#121212",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Sign Up / Sign In
          </div>
        </div>

        <div
          style={{
            height: 74,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFFFFF",
            borderBottom: "1px solid #D8E1EA",
          }}
        >
          <img
            src={logoImage}
            alt="Hearst+"
            width="300"
            height="48"
            style={{
              width: 300,
              height: 48,
              objectFit: "contain",
            }}
          />
        </div>

        <div
          style={{
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 34,
            background: "#FFFFFF",
            borderBottom: "1px solid #D8E1EA",
            fontSize: 13,
          }}
        >
          <span style={{ padding: "12px 0 9px", color: "#2D75B9", borderBottom: "3px solid #2D75B9", fontWeight: 700 }}>For You</span>
          <span>Home</span>
          <span>Style</span>
          <span>Reviews</span>
          <span>Fitness</span>
          <span>Cars</span>
          <span>Shopping</span>
          <span>Games</span>
          <span>Saved</span>
        </div>

        <div
          style={{
            height: 116,
            padding: "20px 54px",
            display: "flex",
            gap: 34,
            background: "#FFFFFF",
            borderBottom: "1px solid #D8E1EA",
          }}
        >
          {[
            ["CONTINUE READING", "Hyundai Santa Cruz Buyer's Guide Review"],
            ["NEW FROM YOUR BRANDS", "Our 2025 Ram 1500 Is Loved by Everyone"],
            ["TRENDING TODAY", "The Best Dressed Celebrities at Paris Couture Week"],
            ["YOUR COLLECTIONS", "2026 Lamborghini Temerario Street Drive"],
          ].map(([label, title], index) => (
            <div key={label} style={{ width: index === 2 ? 264 : 238, display: "flex", flexDirection: "column" }}>
              <span style={sectionLabel}>{label}</span>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 62,
                    height: 46,
                    display: "flex",
                    flexShrink: 0,
                    borderRadius: 7,
                    background: index === 0 ? "#9BB6C8" : index === 1 ? "#C5B09A" : index === 2 ? "#C9AFCB" : "#8C78B0",
                  }}
                />
                <span style={{ display: "flex", fontSize: 14, lineHeight: 1.2, fontWeight: 700 }}>{title}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: "28px 48px", display: "flex", gap: 24 }}>
          <div
            style={{
              width: 188,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              background: "#FFFFFF",
              border: "1px solid #C8D8E8",
              borderRadius: 8,
            }}
          >
            <span style={sectionLabel}>YOUR DAILY HABIT</span>
            <span style={{ marginTop: 16, display: "flex", fontSize: 11, fontWeight: 800, color: "#2D75B9" }}>STYLE</span>
            <span style={{ marginTop: 7, display: "flex", fontSize: 15, lineHeight: 1.2, fontWeight: 700 }}>
              The Best Dressed Celebrities at Paris Couture Week
            </span>
            <span style={{ marginTop: 8, display: "flex", fontSize: 11, color: "#687A8D" }}>Harper&apos;s Bazaar · Popularity 101</span>
            <span style={{ marginTop: 15, height: 1, display: "flex", background: "#D6E0EA" }} />
            <span style={{ marginTop: 14, display: "flex", fontSize: 11, fontWeight: 800, color: "#2D75B9" }}>REVIEWS</span>
            <span style={{ marginTop: 7, display: "flex", fontSize: 14, lineHeight: 1.2, fontWeight: 700 }}>
              Our 2025 Ram 1500 Is Loved by Everyone
            </span>
          </div>

          <div
            style={{
              position: "relative",
              width: 642,
              display: "flex",
              overflow: "hidden",
              borderRadius: 8,
              background: "#17202A",
            }}
          >
            <img
              src={leadImage}
              alt=""
              width="642"
              height="330"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                background: "linear-gradient(180deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.84) 100%)",
              }}
            />
            <div style={{ position: "absolute", top: 18, left: 18, padding: "6px 12px", display: "flex", borderRadius: 999, background: "rgba(0,0,0,.55)", color: "#FFFFFF", fontSize: 13, fontWeight: 700 }}>
              1 of 5
            </div>
            <div style={{ position: "absolute", top: 18, right: 18, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(0,0,0,.55)", color: "#FFFFFF", fontSize: 15 }}>
              Ⅱ
            </div>
            <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, display: "flex", flexDirection: "column", color: "#FFFFFF" }}>
              <span style={{ display: "flex", fontSize: 14, fontWeight: 700 }}>Harper&apos;s Bazaar&nbsp; / &nbsp;14</span>
              <span style={{ marginTop: 8, display: "flex", maxWidth: 560, fontFamily: "Georgia, serif", fontSize: 35, lineHeight: 1.03, fontWeight: 700 }}>
                The Best Dressed Celebrities at Paris Couture Week
              </span>
              <span style={{ marginTop: 10, display: "flex", fontSize: 15, color: "rgba(255,255,255,.86)" }}>
                From Tilda Swinton in Chanel to Cynthia Erivo in Balenciaga
              </span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              background: "#FFFFFF",
              border: "1px solid #C8D8E8",
              borderRadius: 8,
            }}
          >
            <span style={sectionLabel}>TRENDING ACROSS BRANDS</span>
            {[
              "The Best Dressed Celebrities at Paris Couture Week",
              "Our 2025 Ram 1500 Is Loved by Everyone",
              "2026 Lamborghini Temerario Street Drive",
            ].map((title, index) => (
              <div key={title} style={{ marginTop: 14, display: "flex", alignItems: "flex-start", gap: 11 }}>
                <span style={{ width: 23, height: 23, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: 999, background: "#2D75B9", color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}>
                  {index + 1}
                </span>
                <span style={{ display: "flex", fontSize: 13, lineHeight: 1.2, fontWeight: 700 }}>{title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
