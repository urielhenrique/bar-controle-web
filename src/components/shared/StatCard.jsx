import React from "react";
import { cn } from "@/lib/utils";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "emerald",
}) {
  const colors = {
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-red-500 to-red-600",
    blue: "from-blue-500 to-blue-600",
    violet: "from-violet-500 to-violet-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow h-full overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl bg-gradient-to-br text-white flex-shrink-0",
            colors[color],
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
