import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const config = {
  OK: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: CheckCircle2,
    label: "Estoque OK",
  },
  Atenção: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: AlertTriangle,
    label: "Atenção",
  },
  Repor: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    icon: XCircle,
    label: "Repor Agora",
  },
};

export default function StatusBadge({ status = "OK", size = "sm" }) {
  const c = config[status] || config.OK;
  const Icon = c.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        c.bg,
        c.text,
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {c.label}
    </span>
  );
}
