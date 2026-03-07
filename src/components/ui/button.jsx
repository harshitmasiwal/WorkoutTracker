import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_10px_24px_-10px_rgba(14,165,233,0.85)] hover:brightness-110 active:scale-[0.98]",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
        outline:
          "border border-slate-300 bg-white/90 text-slate-900 hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
        ghost: "text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <button
    className={cn(buttonVariants({ variant, size, className }))}
    ref={ref}
    {...props}
  />
));

Button.displayName = "Button";

export { Button, buttonVariants };
