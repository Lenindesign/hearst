# Hearst Design System and Reader Prototypes

This Next.js workspace contains the Hearst Design System token pipeline, component documentation, and the Hearst+ destination and reader prototypes.

## Documentation

The project root is also an Obsidian vault. Start with [`VAULT_HOME.md`](VAULT_HOME.md).

- [`DESIGN-SYSTEM-SPEC.md`](DESIGN-SYSTEM-SPEC.md): HDS token architecture and component contracts
- [`PRODUCT.md`](PRODUCT.md): product purpose and design principles
- [`DESIGN.md`](DESIGN.md): concise design-tool context
- [`STYLE.md`](STYLE.md): shared visual and interaction rules
- [`BRAND_STYLES.md`](BRAND_STYLES.md): brand identity, route-theme mapping, and runtime font status
- [`APP_RULES.md`](APP_RULES.md): personalization, content, route, reader, and scoped-exception behavior
- [`DECISION_LOG.md`](DECISION_LOG.md): dated decision history

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

Run checks appropriate to the files changed:

```bash
npm run lint
npm run build
npm run tokens:validate
npm run publications:validate
```

When canonical publication tokens change, rebuild generated outputs with the repository token scripts. Do not edit `src/lib/brands.ts` or `src/lib/tokens.css` directly.

## Deployment

Deployment is explicit. Ordinary documentation or interface changes do not authorize a deploy. When deployment is requested, validate the requested application or Storybook target before publishing it.
