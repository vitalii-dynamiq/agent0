import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[13px] font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-border bg-background shadow-xs hover:bg-muted hover:border-muted-foreground/20",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
        // Futurist pill button with arrow
        futurist:
          "!rounded-full border border-foreground/30 bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/5 gap-2 px-5 text-[12px] font-medium tracking-wide",
        // Futurist ghost - no background, hover shifts
        "futurist-ghost":
          "bg-transparent text-muted-foreground hover:text-foreground gap-2 text-[12px] font-medium tracking-wide hover:gap-3",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        sm: "h-7 gap-1 px-2.5 text-xs",
        lg: "h-9 px-4",
        xl: "h-10 px-6 text-[14px]",
        icon: "size-8",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
      shape: {
        default: "rounded-md",
        squared: "rounded-[3px]",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
