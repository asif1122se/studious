import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className, ...props }: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-background border border-border rounded-lg shadow-md p-6", className)} {...props}>
      {children}
    </div>
  );
} 