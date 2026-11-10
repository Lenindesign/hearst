"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Children, type ReactNode } from "react"

import { SpinnerGap } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--component-button-radius-default)] border bg-clip-padding text-sm whitespace-nowrap transition-[background-color,border-color,color,box-shadow,opacity] outline-none select-none motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        secondary: "",
        ghost: "",
        destructive:
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 active:bg-destructive/30 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:active:bg-destructive/40 dark:focus-visible:ring-destructive/40",
        link:
          "underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        touch:
          "min-h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        icon: "size-8",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        "icon-touch": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  /** Presents a busy, non-interactive state while preserving the button label. */
  loading?: boolean
  /** Optional temporary label announced and shown while loading. */
  loadingText?: ReactNode
  /**
   * Optically centers the label by trimming its box to cap height and baseline.
   * `"auto"` (default) trims only when the label is plain text without descender glyphs
   * (lowercase g, j, p, q, y or uppercase J, Q), so "Sign up" keeps normal
   * metrics while "SIGN IN" or "Read the review" is trimmed. `true` always
   * trims (only for labels known to have no descenders); `false` opts out.
   */
  capAlignedLabel?: boolean | "auto"
}

const descenderGlyphs = /[gjpqyJQ]/

function isText(node: ReactNode): node is string | number {
  return typeof node === "string" || typeof node === "number"
}

/**
 * True when a label's text can be trimmed to cap height without clipping
 * glyphs. Icons and other elements beside the text are ignored; a label with
 * no text, or with text nested inside other elements, is left alone.
 */
function canCapAlignLabel(label: ReactNode) {
  const parts = Children.toArray(label)
  const text = parts.filter(isText).map(String).join("")
  if (!text.trim()) return false
  if (parts.some((part) => !isText(part) && !isIconElement(part))) return false
  return !descenderGlyphs.test(text)
}

function isIconElement(node: ReactNode) {
  if (!node || typeof node !== "object" || !("props" in node)) return false
  const props = node.props as Record<string, unknown>
  return props["aria-hidden"] === true || props["aria-hidden"] === "true" || "data-icon" in props
}

/**
 * Wraps the text of a button label in the cap-aligned span and leaves icons
 * beside it, so "Continue" + chevron is centered on its cap height too. Use it
 * for links styled with `buttonVariants()`, which do not go through `Button`.
 */
function capAlignButtonLabel(label: ReactNode, mode: boolean | "auto" = "auto"): ReactNode {
  const shouldCapAlign = mode === "auto" ? canCapAlignLabel(label) : mode
  if (!shouldCapAlign) return label
  return Children.toArray(label).map((part, index) =>
    isText(part) && String(part).trim()
      ? <span key={`cap-label-${index}`} className="hds-cap-aligned-label">{part}</span>
      : part,
  )
}

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  loadingText,
  capAlignedLabel = "auto",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const currentLabel = loading ? loadingText ?? children : children
  const label = capAlignButtonLabel(currentLabel, capAlignedLabel)

  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading ? (
        <>
          <SpinnerGap data-icon="inline-start" className="animate-spin motion-reduce:animate-none" aria-hidden />
          {label}
        </>
      ) : label}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants, canCapAlignLabel, capAlignButtonLabel }
