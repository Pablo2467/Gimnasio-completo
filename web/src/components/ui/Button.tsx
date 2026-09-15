import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-sm transition-colors " +
    "disabled:opacity-40 disabled:cursor-not-allowed";

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };

  const variants = {
    primary: "bg-plate-blue text-white hover:bg-plate-blue-dark",
    secondary: "bg-white text-iron-950 border border-iron-200 hover:border-iron-400",
    danger: "bg-white text-plate-red border border-plate-red/30 hover:bg-plate-red hover:text-white",
    ghost: "text-iron-700 hover:bg-iron-200/60",
  };

  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}