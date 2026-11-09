/**
 * Primary header CTA of each publication's live site, captured with Playwright (Chromium, 1440 px)
 * from the homepage on 2026-11-09. Read-only reference for the brand guides on /token-specs/: the token
 * source now carries the typography as component-button-font-family, -font-weight, -text-transform and
 * -letter-spacing (promoted from this capture); this file stays as the dated reference sample.
 */
export type BrandCtaSpec = {
  slug: string;
  label: string;
  fontFamily: string;
  /** False when the family is not served by the app, so the sample falls back. */
  hosted: boolean;
  fontWeight: number;
  fontSize: number;
  textTransform: "none" | "uppercase" | "capitalize";
  letterSpacing: string;
  color: string;
  background: string;
  radius: number;
  height: number;
  padding: string;
};

export const brandCtaCapturedAt = "2026-11-09";

export const brandCtaSpecs: Record<string, BrandCtaSpec> = {
  "autoweek": {"slug": "autoweek", "label": "NEWSLETTER", "fontFamily": "Montserrat", "hosted": true, "fontWeight": 800, "fontSize": 12.0, "textTransform": "uppercase", "letterSpacing": "0.4px", "color": "#242424", "background": "#ffc84e", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "best-products": {"slug": "best-products", "label": "Newsletter", "fontFamily": "Montserrat", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#121212", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "bicycling": {"slug": "bicycling", "label": "SUBSCRIBE", "fontFamily": "Teko", "hosted": true, "fontWeight": 400, "fontSize": 16.0, "textTransform": "uppercase", "letterSpacing": "2.4px", "color": "#ffffff", "background": "#067ea7", "radius": 0.0, "height": 30, "padding": "0px 16px"},
  "biography": {"slug": "biography", "label": "Newsletter", "fontFamily": "SF Pro", "hosted": false, "fontWeight": 400, "fontSize": 13.0, "textTransform": "none", "letterSpacing": "0.72px", "color": "#ffffff", "background": "transparent", "radius": 0.0, "height": 28, "padding": "6px 0px"},
  "car-and-driver": {"slug": "car-and-driver", "label": "SUBSCRIBE", "fontFamily": "Inter", "hosted": true, "fontWeight": 500, "fontSize": 12.0, "textTransform": "uppercase", "letterSpacing": "0.44px", "color": "#ffffff", "background": "#1c5f8b", "radius": 4.0, "height": 38, "padding": "12px 15px"},
  "cosmopolitan": {"slug": "cosmopolitan", "label": "Newsletter", "fontFamily": "Basis Grotesque Pro", "hosted": true, "fontWeight": 600, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#d70000", "radius": 1024.0, "height": 32, "padding": "0px 12px"},
  "country-living": {"slug": "country-living", "label": "SUBSCRIBE", "fontFamily": "Montserrat", "hosted": true, "fontWeight": 700, "fontSize": 13.0, "textTransform": "uppercase", "letterSpacing": "normal", "color": "#0a5c80", "background": "#cde5f0", "radius": 0.0, "height": 30, "padding": "0px 16px"},
  "delish": {"slug": "delish", "label": "Newsletter", "fontFamily": "TT Commons Pro", "hosted": true, "fontWeight": 600, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#004685", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "elle": {"slug": "elle", "label": "Newsletter", "fontFamily": "Neue Haas Unica Pro", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#000000", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "elle-decor": {"slug": "elle-decor", "label": "Newsletter", "fontFamily": "Source Sans 3", "hosted": false, "fontWeight": 700, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "normal", "color": "#ffffff", "background": "#121212", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "esquire": {"slug": "esquire", "label": "Newsletter", "fontFamily": "Lausanne", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#121212", "background": "#ff3a30", "radius": 1024.0, "height": 32, "padding": "0px 12px"},
  "good-housekeeping": {"slug": "good-housekeeping", "label": "Newsletter", "fontFamily": "Barlow Semi Condensed", "hosted": true, "fontWeight": 600, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#121212", "background": "#53c2be", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "harpers-bazaar": {"slug": "harpers-bazaar", "label": "Newsletter", "fontFamily": "Helvetica Now Text", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#000000", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "house-beautiful": {"slug": "house-beautiful", "label": "NEWSLETTER", "fontFamily": "Visuelt Pro", "hosted": true, "fontWeight": 500, "fontSize": 13.0, "textTransform": "uppercase", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#242d39", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "mens-health": {"slug": "mens-health", "label": "Newsletter", "fontFamily": "Manrope", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#d2232e", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "oprah-daily": {"slug": "oprah-daily", "label": "SUBSCRIBE", "fontFamily": "Poppins", "hosted": true, "fontWeight": 700, "fontSize": 14.0, "textTransform": "uppercase", "letterSpacing": "0.72px", "color": "#ffffff", "background": "#e61957", "radius": 800.0, "height": 30, "padding": "10px 16px"},
  "popular-mechanics": {"slug": "popular-mechanics", "label": "Newsletter", "fontFamily": "Work Sans", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#1c6a65", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "prevention": {"slug": "prevention", "label": "Newsletter", "fontFamily": "Poppins", "hosted": true, "fontWeight": 700, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#121212", "background": "#44c1c5", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "redbook": {"slug": "redbook", "label": "Newsletter", "fontFamily": "League Spartan", "hosted": true, "fontWeight": 700, "fontSize": 13.0, "textTransform": "none", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#d30c4f", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "road-and-track": {"slug": "road-and-track", "label": "Newsletter", "fontFamily": "Roboto", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#bb322f", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "runners-world": {"slug": "runners-world", "label": "NEWSLETTER", "fontFamily": "Futura Now Text", "hosted": true, "fontWeight": 700, "fontSize": 13.0, "textTransform": "uppercase", "letterSpacing": "0.4px", "color": "#121212", "background": "#59e7ed", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "seventeen": {"slug": "seventeen", "label": "Newsletter", "fontFamily": "GT Walsheim", "hosted": false, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#121212", "background": "#ff92de", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "the-pioneer-woman": {"slug": "the-pioneer-woman", "label": "Newsletter", "fontFamily": "Livvic", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#121212", "background": "#f4edd8", "radius": 1024.0, "height": 32, "padding": "0px 12px"},
  "town-and-country": {"slug": "town-and-country", "label": "Newsletter", "fontFamily": "Montserrat", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#9a0500", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "veranda": {"slug": "veranda", "label": "SUBSCRIBE", "fontFamily": "League Spartan", "hosted": true, "fontWeight": 700, "fontSize": 13.0, "textTransform": "uppercase", "letterSpacing": "0.72px", "color": "#000000", "background": "#f3ebd9", "radius": 0.0, "height": 30, "padding": "0px 16px"},
  "womans-day": {"slug": "womans-day", "label": "Newsletter", "fontFamily": "League Spartan", "hosted": true, "fontWeight": 400, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#683d85", "radius": 0.0, "height": 32, "padding": "0px 12px"},
  "womens-health": {"slug": "womens-health", "label": "Newsletter", "fontFamily": "Altone", "hosted": true, "fontWeight": 600, "fontSize": 13.0, "textTransform": "capitalize", "letterSpacing": "0.4px", "color": "#ffffff", "background": "#1d4ed8", "radius": 0.0, "height": 32, "padding": "0px 12px"},
};
