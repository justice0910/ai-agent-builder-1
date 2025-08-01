import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

// @ts-ignore
const Separator = React.forwardRef<
  // @ts-ignore
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  // @ts-ignore
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    // @ts-ignore
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    // @ts-ignore
    <SeparatorPrimitive.Root
      // @ts-ignore
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
