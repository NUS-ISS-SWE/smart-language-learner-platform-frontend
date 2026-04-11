import React from "react";

type Color = "gray" | "indigo" | "teal" | "green" | "yellow" | "red";

export interface BadgeProps {
  children: React.ReactNode;
  color?: Color;
  className?: string;
}

const colorClasses: Record<Color, string> = {
  gray: "bg-gray-100 text-gray-700",
  indigo: "bg-indigo-100 text-indigo-700",
  teal: "bg-teal-100 text-teal-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
};

export function Badge({ children, color = "gray", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClasses[color],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
