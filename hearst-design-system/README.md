# Hearst Design System and Reader Prototypes

This Next.js workspace contains the Hearst Design System token pipeline, component documentation, and the Hearst+ destination and reader prototypes.

## Documentation

The project root is also an Obsidian vault. Start with [`VAULT_HOME.md`](VAULT_HOME.md).

- [`DESIGN-SYSTEM-SPEC.md`](DESIGN-SYSTEM-SPEC.md): HDS token architecture and component contracts
- [`PRODUCT.md`](PRODUCT.md): product purpose and design principles
- [`DESIGN.md`](DESIGN.md): concise design-tool routing bridge
- [`STYLE.md`](STYLE.md): shared visual and interaction rules
- [`BRAND_STYLES.md`](BRAND_STYLES.md): brand identity, route-theme mapping, and runtime font status
- [`APP_RULES.md`](APP_RULES.md): personalization, content, route, reader, and scoped-exception behavior
- [`DECISION_LOG.md`](DECISION_LOG.md): dated decision history
- [`CONTRIBUTING.md`](CONTRIBUTING.md): ownership, story acceptance, review, and deprecation policy
- [`CHANGELOG.md`](CHANGELOG.md): release-facing changes and release checklist

## Local development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/hearst-plus/](http://localhost:3000/hearst-plus/) for Hearst+ or use the destination routes documented in `BRAND_STYLES.md`.

Start Storybook separately when component documentation is in scope:

```bash
npm run storybook
```

## Validation

Run the complete local quality gate:

```bash
npm run quality
npm run build-storybook
npm run build
```

When canonical publication tokens change, rebuild generated outputs with the repository token scripts. Do not edit `src/lib/brands.ts` or `src/lib/tokens.css` directly.

## Deployment

Deployment is explicit. Ordinary documentation or interface changes do not authorize a deploy. When deployment is requested, validate the requested application or Storybook target before publishing it.
## Google One Tap (optional)

The Personalize dialog can use real Google One Tap. Browser-local email profiles remain on one device, while verified Google profiles sync preferences, saved stories, collections, and comments through the prototype profile store. Configure a Google OAuth web client with the local and deployed JavaScript origins, then set matching values before starting the app:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

`GOOGLE_CLIENT_ID` stays server-only and is used by `/api/auth/google` to verify the returned Google identity credential. Verified Google profiles are synced through `/api/reader-profile` so saved stories and profile settings can follow the same signed-in reader across devices. Leave `NEXT_PUBLIC_GOOGLE_CLIENT_ID` unset to hide the Google option and keep the browser-local email profile flow only. Configure the server value before enabling the public client ID.
