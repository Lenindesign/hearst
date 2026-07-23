import React from "react";
import {
  getHearstDestinationCategoryRoute,
  hearstDestinationCategoryLabels,
  hearstDestinationRoutes,
  type HearstDestinationMode,
} from "@/lib/hearst-routes";

type Destination = {
  mode: Exclude<HearstDestinationMode, "all">;
  name: string;
  description: string;
  publicationRoute: string;
};

const destinations: Destination[] = [
  {
    mode: "lifestyle",
    name: "Lifestyle",
    description: "Home, food, style, wellness, family, and entertainment.",
    publicationRoute: "/lifestyle/[brandSlug]/",
  },
  {
    mode: "autos",
    name: "Autos",
    description: "News, reviews, buying guides, EVs, racing, trucks, and classics.",
    publicationRoute: "/autos/[brandSlug]/",
  },
  {
    mode: "flux",
    name: "Fashion & Luxury",
    description: "Style, beauty, design, culture, shopping, events, and travel.",
    publicationRoute: "/flux/[brandSlug]/",
  },
  {
    mode: "ew",
    name: "Enthusiast & Wellness",
    description: "Fitness, wellness, gear, technology, adventure, nutrition, and life.",
    publicationRoute: "/ew/[brandSlug]/",
  },
];

const prototypeRoutes = [
  { route: "/hearst-plus/live-feed/", purpose: "Live-feed prototype" },
  { route: "/hearst-plus/complete-articles/", purpose: "Complete-article review" },
  { route: "/hearst-plus/lifestyle-live/", purpose: "Lifestyle feed inspection" },
  { route: "/hearst-plus/motortrend-videos/", purpose: "Video-feed inspection" },
  { route: "/hearst-product-blueprint/", purpose: "Product blueprint" },
  { route: "/about-hearst-magazines/", purpose: "Product story (legacy route name)" },
  { route: "/why-hearst-plus/", purpose: "Hearst+ value proposition" },
];

const routeSources = [
  "src/lib/hearst-routes.ts",
  "src/app/hearst-plus/",
  "src/app/hearst-destination-category-page.tsx",
  "src/app/read/[storyId]/page.tsx",
];

function Route({ children }: { children: React.ReactNode }) {
  return <code className="hp-site-map__route">{children}</code>;
}

function CategoryRoutes({ mode }: { mode: HearstDestinationMode }) {
  return (
    <ul className="hp-site-map__route-list" aria-label={`${mode} category routes`}>
      {hearstDestinationCategoryLabels[mode].map((label) => (
        <li key={label}>
          <span>{label}</span>
          <Route>{getHearstDestinationCategoryRoute(mode, label)}</Route>
        </li>
      ))}
    </ul>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="hp-site-map__destination">
      <div className="hp-site-map__destination-header">
        <p className="hp-site-map__index">
          {String(destinations.findIndex((candidate) => candidate.mode === destination.mode) + 2).padStart(2, "0")}
        </p>
        <h3>{destination.name}</h3>
        <Route>{hearstDestinationRoutes[destination.mode]}</Route>
      </div>
      <p className="hp-site-map__description">{destination.description}</p>
      <CategoryRoutes mode={destination.mode} />
      <div className="hp-site-map__publication">
        <span>Publication destinations</span>
        <Route>{destination.publicationRoute}</Route>
      </div>
    </article>
  );
}

function Contract({
  title,
  type,
  route,
  children,
}: {
  title: string;
  type: string;
  route?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="hp-site-map__contract">
      <p className="hp-site-map__type">{type}</p>
      <h3>{title}</h3>
      {route ? <Route>{route}</Route> : null}
      <p>{children}</p>
    </article>
  );
}

export function HearstPlusSiteMap() {
  return (
    <div className="hp-site-map">
      <style>{`
        .hp-site-map {
          --map-ink: #111111;
          --map-muted: #57534e;
          --map-line: #c9c9c4;
          --map-soft: #f2f2ef;
          margin: 28px 0 44px;
          color: var(--map-ink);
          font-family: var(--font-primary, Arial, sans-serif);
        }
        .hp-site-map *,
        .hp-site-map *::before,
        .hp-site-map *::after {
          box-sizing: border-box;
        }
        .hp-site-map h2,
        .hp-site-map h3,
        .hp-site-map p {
          margin: 0;
        }
        .hp-site-map__eyebrow,
        .hp-site-map__index,
        .hp-site-map__type {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          line-height: 1.3;
          text-transform: uppercase;
        }
        .hp-site-map__intro {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: end;
          padding: 0 0 18px;
          border-bottom: 1px solid var(--map-ink);
        }
        .hp-site-map__intro h2 {
          margin-top: 6px;
          max-width: 16ch;
          font-size: clamp(28px, 5vw, 52px);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 0.98;
        }
        .hp-site-map__intro a {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--map-ink);
          padding: 0 14px;
          color: var(--map-ink);
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }
        .hp-site-map__intro a:hover {
          background: var(--map-ink);
          color: #ffffff;
        }
        .hp-site-map__root {
          position: relative;
          display: grid;
          grid-template-columns: 56px minmax(0, 1fr);
          gap: 18px;
          margin: 36px auto 48px;
          max-width: 760px;
          border: 2px solid var(--map-ink);
          padding: 22px;
          background: #ffffff;
        }
        .hp-site-map__root::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          height: 50px;
          border-left: 1px solid var(--map-ink);
        }
        .hp-site-map__root h3 {
          margin: 3px 0 8px;
          font-size: 24px;
          line-height: 1.05;
        }
        .hp-site-map__root-copy {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 18px;
          align-items: center;
        }
        .hp-site-map__root-copy p {
          color: var(--map-muted);
          font-size: 14px;
          line-height: 1.5;
        }
        .hp-site-map__destinations {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .hp-site-map__destinations::before {
          content: "";
          position: absolute;
          right: 12.5%;
          bottom: calc(100% + 16px);
          left: 12.5%;
          border-top: 1px solid var(--map-ink);
        }
        .hp-site-map__destination {
          position: relative;
          min-width: 0;
          border: 1px solid var(--map-ink);
          background: #ffffff;
        }
        .hp-site-map__destination::before {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          height: 17px;
          border-left: 1px solid var(--map-ink);
        }
        .hp-site-map__destination-header {
          display: grid;
          grid-template-columns: 36px minmax(0, 1fr);
          gap: 5px 12px;
          align-items: baseline;
          padding: 16px;
          border-bottom: 1px solid var(--map-ink);
        }
        .hp-site-map__destination-header h3 {
          font-size: 20px;
          line-height: 1.1;
        }
        .hp-site-map__destination-header .hp-site-map__route {
          grid-column: 2;
        }
        .hp-site-map__description {
          min-height: 64px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--map-line);
          color: var(--map-muted);
          font-size: 13px;
          line-height: 1.55;
        }
        .hp-site-map__route {
          display: inline-block;
          max-width: 100%;
          overflow-wrap: anywhere;
          color: var(--map-ink);
          font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
          font-size: 11px;
          font-weight: 500;
          line-height: 1.45;
          white-space: normal;
        }
        .hp-site-map__route-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .hp-site-map__route-list li {
          display: grid;
          grid-template-columns: minmax(88px, 0.42fr) minmax(0, 1fr);
          gap: 12px;
          align-items: baseline;
          min-width: 0;
          padding: 9px 16px;
          border-bottom: 1px solid var(--map-line);
          font-size: 12px;
        }
        .hp-site-map__publication {
          display: grid;
          grid-template-columns: minmax(120px, 0.42fr) minmax(0, 1fr);
          gap: 12px;
          padding: 13px 16px;
          background: var(--map-soft);
          font-size: 12px;
          font-weight: 700;
        }
        .hp-site-map__section {
          margin-top: 48px;
        }
        .hp-site-map__section-header {
          display: grid;
          grid-template-columns: 56px minmax(0, 1fr);
          gap: 18px;
          align-items: end;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--map-ink);
        }
        .hp-site-map__section-header h2 {
          font-size: 26px;
          letter-spacing: -0.025em;
          line-height: 1.05;
        }
        .hp-site-map__contracts {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 1px solid var(--map-ink);
          border-left: 1px solid var(--map-ink);
        }
        .hp-site-map__contract {
          min-width: 0;
          min-height: 210px;
          padding: 18px;
          border-right: 1px solid var(--map-ink);
          border-bottom: 1px solid var(--map-ink);
        }
        .hp-site-map__contract h3 {
          margin: 8px 0 10px;
          font-size: 18px;
          line-height: 1.15;
        }
        .hp-site-map__contract > p:last-child {
          margin-top: 14px;
          color: var(--map-muted);
          font-size: 13px;
          line-height: 1.55;
        }
        .hp-site-map__prototype-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--map-ink);
          border-left: 1px solid var(--map-ink);
          list-style: none;
        }
        .hp-site-map__prototype-list li {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(140px, 0.6fr);
          gap: 16px;
          min-width: 0;
          padding: 13px 14px;
          border-right: 1px solid var(--map-ink);
          border-bottom: 1px solid var(--map-ink);
          font-size: 12px;
        }
        .hp-site-map__prototype-list span {
          color: var(--map-muted);
        }
        .hp-site-map__footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid var(--map-ink);
          color: var(--map-muted);
          font-size: 12px;
          line-height: 1.55;
        }
        .hp-site-map__footer ul {
          margin: 8px 0 0;
          padding: 0;
          list-style: none;
        }
        .hp-site-map__footer a {
          color: var(--map-ink);
          text-underline-offset: 3px;
        }
        @media (max-width: 800px) {
          .hp-site-map__intro,
          .hp-site-map__footer {
            grid-template-columns: 1fr;
          }
          .hp-site-map__intro a {
            justify-self: start;
          }
          .hp-site-map__destinations,
          .hp-site-map__contracts,
          .hp-site-map__prototype-list {
            grid-template-columns: 1fr;
          }
          .hp-site-map__destinations::before,
          .hp-site-map__destination::before,
          .hp-site-map__root::after {
            display: none;
          }
          .hp-site-map__destination,
          .hp-site-map__contract,
          .hp-site-map__prototype-list li {
            min-height: 0;
          }
        }
        @media (max-width: 520px) {
          .hp-site-map__root,
          .hp-site-map__section-header {
            grid-template-columns: 1fr;
          }
          .hp-site-map__route-list li,
          .hp-site-map__publication,
          .hp-site-map__prototype-list li {
            grid-template-columns: 1fr;
            gap: 5px;
          }
        }
      `}</style>

      <header className="hp-site-map__intro">
        <div>
          <p className="hp-site-map__eyebrow">Information architecture</p>
          <h2>One reader system, four destination branches.</h2>
        </div>
        <a
          href="https://www.figma.com/design/GmkdDGo2mU8jnM6fzlowUz/PRISM?node-id=73-12"
          target="_blank"
          rel="noreferrer"
        >
          Open the PRISM source
        </a>
      </header>

      <section className="hp-site-map__root" aria-labelledby="hearst-plus-root">
        <p className="hp-site-map__index">01</p>
        <div>
          <h3 id="hearst-plus-root">Hearst+ / All</h3>
          <div className="hp-site-map__root-copy">
            <Route>{hearstDestinationRoutes.all}</Route>
            <p>Cross-brand personalized entry point and shared product shell.</p>
          </div>
        </div>
      </section>

      <section className="hp-site-map__destinations" aria-label="Hearst+ destinations">
        {destinations.map((destination) => (
          <DestinationCard key={destination.mode} destination={destination} />
        ))}
      </section>

      <section className="hp-site-map__section" aria-labelledby="shared-contracts">
        <div className="hp-site-map__section-header">
          <p className="hp-site-map__index">06</p>
          <h2 id="shared-contracts">Shared routes and experience contracts</h2>
        </div>
        <div className="hp-site-map__contracts">
          <Contract title="Story reader" type="Dynamic public route" route="/read/[storyId]/?from=[safeReturnPath]">
            Opens the selected article, gallery, or video while preserving the reader’s return context.
          </Contract>
          <Contract title="Reader state" type="In-app state">
            Saved stories, follows, preferences, hidden stories, and personalization controls are product states rather than separate page families.
          </Contract>
          <Contract title="Content formats" type="Ranked inventory">
            Articles, photo galleries, horizontal video, and vertical video share the river but use format-specific cards and reader treatments.
          </Contract>
        </div>
      </section>

      <section className="hp-site-map__section" aria-labelledby="prototype-routes">
        <div className="hp-site-map__section-header">
          <p className="hp-site-map__index">07</p>
          <h2 id="prototype-routes">Review, prototype, and internal routes</h2>
        </div>
        <ul className="hp-site-map__prototype-list">
          {prototypeRoutes.map((item) => (
            <li key={item.route}>
              <Route>{item.route}</Route>
              <span>{item.purpose}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="hp-site-map__footer">
        <div>
          <strong>Route authority</strong>
          <ul>
            {routeSources.map((source) => (
              <li key={source}><Route>{source}</Route></li>
            ))}
          </ul>
        </div>
        <p>
          The PRISM diagram establishes the product model. This Storybook version resolves it against the current application routes, so renamed, dynamic, and prototype-only paths are disclosed instead of presented as equivalent public pages.
        </p>
      </footer>
    </div>
  );
}
