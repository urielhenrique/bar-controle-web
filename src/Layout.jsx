import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Package,
  Truck,
  History,
  Menu,
  X,
  Beer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Produtos", icon: Package, page: "Produtos" },
  { name: "Fornecedores", icon: Truck, page: "Fornecedores" },
  { name: "Movimentações", icon: History, page: "Movimentacoes" },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <style>{`
        :root {
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        body { font-family: var(--font-sans); }
      `}</style>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <Beer className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="font-bold text-gray-900">BarStock</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-14 left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-100 px-4 py-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 mb-8">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Beer className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">BarStock</span>
              <p className="text-xs text-gray-400">Controle de Estoque</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1 flex-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                  )}
                >
                  <Icon
                    className={cn("w-5 h-5", active ? "text-emerald-600" : "")}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 py-3 bg-gray-50 rounded-xl mt-4">
            <p className="text-xs text-gray-400 text-center">BarStock v1.0</p>
            <p className="text-xs text-gray-300 text-center mt-0.5">
              Gestão simples de estoque
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">{children}</div>
      </div>
    </div>
  );
}
