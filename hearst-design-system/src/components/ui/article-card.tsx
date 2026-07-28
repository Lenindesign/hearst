import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ImageIcon } from "@/components/ui/icons";

const articleCardVariants = cva(
  "group/article-card flex overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      layout: {
        vertical: "flex-col",
        horizontal: "flex-row items-start gap-3",
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
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: ArticleCardProps) {
  const interactive = typeof onClick === "function";

  return (
    <article
      data-slot="article-card"
      data-layout={layout}
      data-size={size}
      role={role ?? (interactive ? "button" : undefined)}
      tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
      className={cn(articleCardVariants({ layout, size }), className)}
      onClick={onClick}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          event.defaultPrevented ||
          !interactive ||
          event.target !== event.currentTarget ||
          (event.key !== "Enter" && event.key !== " ")
        ) {
          return;
        }
        event.preventDefault();
        event.currentTarget.click();
      }}
      {...props}
    />
  );
}

/* ─── Image ─── */

interface ArticleCardImageProps extends React.ComponentProps<"div"> {
  src?: string;
  alt?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2";
  imageFit?: "cover" | "contain";
  imagePosition?: string;
}

function ArticleCardImage({
  className,
  src,
  alt,
  aspectRatio = "16/9",
  imageFit = "cover",
  imagePosition,
  style,
  ...props
}: ArticleCardImageProps) {
  return (
    <div
      data-slot="article-card-image"
      className={cn(
        "relative shrink-0 overflow-hidden bg-muted",
        "group-data-[layout=vertical]/article-card:w-full",
        /* Horizontal: cap thumb so text keeps ~60%+ of the row (e.g. 4-col sidebar). */
        "group-data-[layout=horizontal]/article-card:w-32 group-data-[layout=horizontal]/article-card:max-w-[38%] group-data-[layout=horizontal]/article-card:self-start",
        className
      )}
      style={{
        ...style,
        aspectRatio,
      }}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className={imageFit === "contain" ? "object-contain" : "object-cover"}
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="size-8 text-muted-foreground/30" aria-hidden />
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
        "flex flex-1 flex-col gap-2 px-4 py-4",
        "group-data-[layout=horizontal]/article-card:min-w-0",
        "group-data-[size=sm]/article-card:px-3 group-data-[size=sm]/article-card:py-3 group-data-[size=sm]/article-card:gap-1.5",
        "group-data-[size=lg]/article-card:px-5 group-data-[size=lg]/article-card:py-6 group-data-[size=lg]/article-card:gap-3",
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
        "text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest text-primary",
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
        "group-data-[size=sm]/article-card:text-[length:var(--text-token-4xs)]",
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
      className={cn("font-semibold text-foreground text-[length:var(--text-token-3xs)]", className)}
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
