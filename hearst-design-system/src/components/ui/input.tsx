"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X, type LucideIcon } from "lucide-react";

const inputFieldVariants = cva(
  "flex items-center gap-2 w-full rounded-sm border bg-background transition-colors focus-within:border-foreground",
  {
    variants: {
      size: {
        xl: "h-12 px-4 text-base [&_svg.lead-icon]:size-5",
        lg: "h-8 px-3 text-sm [&_svg.lead-icon]:size-5",
        md: "h-6 px-2 text-sm [&_svg.lead-icon]:size-4",
      },
    },
    defaultVariants: {
      size: "xl",
    },
  }
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputFieldVariants> {
  label?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  leadingIcon?: LucideIcon;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      label,
      required,
      helpText,
      error,
      leadingIcon: LeadingIcon,
      onClear,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== "";
    const showClear = onClear && hasValue && !disabled;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <div className="flex items-center gap-1">
            <label className="text-sm font-semibold text-foreground">
              {label}
            </label>
            {required && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            )}
          </div>
        )}

        <div
          className={cn(
            inputFieldVariants({ size }),
            error &&
              "border-red-700 bg-red-50 focus-within:border-red-700 dark:bg-red-950/20",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {LeadingIcon && (
            <LeadingIcon className="lead-icon shrink-0 text-muted-foreground" />
          )}
          <input
            ref={ref}
            disabled={disabled}
            value={value}
            className={cn(
              "flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
              size === "md" ? "text-sm" : size === "lg" ? "text-sm" : "text-base"
            )}
            {...props}
          />
          {showClear && (
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {error ? (
          <p className="flex items-center gap-1 text-xs text-red-700">
            <svg
              className="size-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            {error}
          </p>
        ) : helpText ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <svg
              className="size-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            {helpText}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputFieldVariants };
