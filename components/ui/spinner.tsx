import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "medium" | "large";
}

export function Spinner({
  size = "medium",
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full !border-t-transparent",
        {
          "h-4 w-4 border-2": size === "small",
          "h-6 w-6 border-2": size === "medium",
          "h-8 w-8 border-3": size === "large",
        },
        "border-primary",
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
