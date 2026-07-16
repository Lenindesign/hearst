"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Info, TriangleAlert, X, type PhosphorIcon } from "@/components/ui/icons";

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
  leadingIcon?: PhosphorIcon;
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
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
            {error}
          </p>
        ) : helpText ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="size-3.5 shrink-0" aria-hidden />
            {helpText}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputFieldVariants };
