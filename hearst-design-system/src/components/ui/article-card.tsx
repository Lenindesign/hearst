import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const articleCardVariants = cva(
  "group/article-card flex overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/20",
  {
    variants: {
      layout: {
        vertical: "flex-col",
        horizontal: "flex-row",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      layout: "vertical",
      size: "default",
    },
  }
);

/* ─── Root ─── */

interface ArticleCardProps
  extends React.ComponentProps<"article">,
    VariantProps<typeof articleCardVariants> {}

function ArticleCard({
  className,
  layout = "vertical",
  size = "default",
  ...props
}: ArticleCardProps) {
  return (
    <article
      data-slot="article-card"
      data-layout={layout}
      data-size={size}
      className={cn(articleCardVariants({ layout, size }), className)}
      {...props}
    />
  );
}

/* ─── Image ─── */

interface ArticleCardImageProps extends React.ComponentProps<"div"> {
  src?: string;
  alt?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2";
}

function ArticleCardImage({
  className,
  src,
  alt,
  aspectRatio = "16/9",
  style,
  ...props
}: ArticleCardImageProps) {
  return (
    <div
      data-slot="article-card-image"
      className={cn(
        "relative shrink-0 overflow-hidden bg-muted",
        "group-data-[layout=vertical]/article-card:w-full",
        "group-data-[layout=horizontal]/article-card:w-48 group-data-[layout=horizontal]/article-card:min-h-full",
        "group-data-[layout=horizontal]/article-card:[aspect-ratio:unset]",
        className
      )}
      style={{
        ...style,
        aspectRatio,
      }}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || ""}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="size-8 text-muted-foreground/30"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── Content ─── */

function ArticleCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="article-card-content"
      className={cn(
        "flex flex-1 flex-col gap-2 px-0 py-4",
        "group-data-[size=sm]/article-card:px-3 group-data-[size=sm]/article-card:py-3 group-data-[size=sm]/article-card:gap-1.5",
        "group-data-[size=lg]/article-card:py-6 group-data-[size=lg]/article-card:gap-3",
        className
      )}
      {...props}
    />
  );
}

/* ─── Eyebrow ─── */

function ArticleCardEyebrow({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="article-card-eyebrow"
      className={cn(
        "text-[11px] font-semibold uppercase tracking-widest text-primary",
        "group-data-[size=lg]/article-card:text-xs",
        className
      )}
      style={{ fontFamily: "var(--font-brand-secondary)", ...style }}
      {...props}
    />
  );
}

/* ─── Title ─── */

function ArticleCardTitle({
  className,
  style,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="article-card-title"
      className={cn(
        "headline leading-snug text-base",
        "group-data-[size=sm]/article-card:text-sm",
        "group-data-[size=lg]/article-card:text-xl",
        className
      )}
      style={style}
      {...props}
    />
  );
}

/* ─── Description ─── */

function ArticleCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="article-card-description"
      className={cn(
        "text-sm leading-relaxed text-muted-foreground line-clamp-3",
        "group-data-[layout=horizontal]/article-card:line-clamp-2",
        "group-data-[size=sm]/article-card:text-xs group-data-[size=sm]/article-card:line-clamp-2",
        className
      )}
      {...props}
    />
  );
}

/* ─── Meta ─── */

function ArticleCardMeta({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="article-card-meta"
      className={cn(
        "mt-auto flex items-center gap-2 pt-1 text-xs text-muted-foreground",
        "group-data-[size=sm]/article-card:text-[11px]",
        className
      )}
      {...props}
    />
  );
}

function ArticleCardMetaItem({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return <span className={cn(className)} {...props} />;
}

function ArticleCardMetaDot() {
  return (
    <span className="text-muted-foreground/50" aria-hidden>
      &middot;
    </span>
  );
}

function ArticleCardAuthor({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="article-card-author"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  );
}

/* ─── Footer ─── */

function ArticleCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="article-card-footer"
      className={cn(
        "flex items-center justify-between border-t px-4 py-3",
        "group-data-[size=sm]/article-card:px-3 group-data-[size=sm]/article-card:py-2",
        className
      )}
      {...props}
    />
  );
}

export {
  ArticleCard,
  ArticleCardImage,
  ArticleCardContent,
  ArticleCardEyebrow,
  ArticleCardTitle,
  ArticleCardDescription,
  ArticleCardMeta,
  ArticleCardMetaItem,
  ArticleCardMetaDot,
  ArticleCardAuthor,
  ArticleCardFooter,
  articleCardVariants,
};
