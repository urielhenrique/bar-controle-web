import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {actionLabel && (
        <Button
          onClick={onAction}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 rounded-xl text-base px-5 h-12 shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
