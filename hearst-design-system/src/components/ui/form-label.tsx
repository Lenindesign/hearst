"use client";

import * as React from "react";
import { Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  helpText?: string;
  error?: string;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, helpText, error, ...props }, ref) => {
    return (
      <div className={cn("space-y-0.5", className)}>
        <label
          ref={ref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-foreground"
          {...props}
        >
          {children}
          {required && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
          )}
        </label>
        {helpText && !error && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="size-3.5 shrink-0" />
            {helpText}
          </p>
        )}
        {error && (
          <p className="flex items-center gap-1 text-xs text-red-700 dark:text-red-400">
            <TriangleAlert className="size-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormLabel.displayName = "FormLabel";

export { FormLabel };
