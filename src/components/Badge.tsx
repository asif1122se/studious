import React from "react";

type BadgeVariant = "primary" | "success" | "error" | "warning" | "foreground";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant = "primary", 
  children,
  className = ""
}) => {
  const variantClasses: Record<BadgeVariant, string> = {
    primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
    success: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    error: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    warning: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    foreground: "bg-background-muted dark:bg-background-subtle text-foreground dark:text-foreground"
  };

  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-0.5 
        text-xs font-medium rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
