import React from "react";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = PackageOpen,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 bg-gray-50 rounded-2xl mb-4">
        <Icon className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <Button
          onClick={onAction}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 rounded-xl text-base px-6 h-12"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
