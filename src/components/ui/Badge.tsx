import { cn } from "../../utils/cn";

interface BadgeProps {
  variant?: "primary" | "secondary" | "success" | "danger";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "primary",
  children,
  className,
}: BadgeProps) {
  const variants = {
    primary: "bg-blue-900 text-blue-200",
    secondary: "bg-[#2d3748] text-gray-300",
    success: "bg-green-900 text-green-200",
    danger: "bg-red-900 text-red-200",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
