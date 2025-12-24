import { cn } from "../../utils/cn";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[#1a1e2e] rounded-lg shadow-md p-6 border border-[#2d3748]",
        className
      )}
    >
      {children}
    </div>
  );
}
