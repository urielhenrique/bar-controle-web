import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { usePlan } from "@/lib/PlanContext";
import {
  LayoutDashboard,
  Package,
  Truck,
  History,
  Menu,
  X,
  LogOut,
  Crown,
  Settings,
  MessageSquare,
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
  const { logout, user } = useAuth();
  const { plan } = usePlan();

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
            <img
              src="/barstock_logo_transparent.png"
              alt="BarStock"
              className="w-8 h-8"
            />
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
              <button
                onClick={() => logout()}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-600 hover:bg-red-50 hover:text-red-700 w-full"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
              <a
                href="https://forms.gle/mMRy68gLFeq9XhSF6"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-600 hover:bg-purple-50 hover:text-purple-700"
              >
                <MessageSquare className="w-5 h-5" />
                Feedback
              </a>
              <Link
                to={createPageUrl("PlanStatus")}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <Settings className="w-5 h-5" />
                {plan === "PRO" ? (
                  <>
                    <Crown className="w-4 h-4" /> Meu Plano PRO
                  </>
                ) : (
                  "Meu Plano (Free)"
                )}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-100 px-4 py-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 mb-8">
            <img
              src="/barstock_logo_transparent.png"
              alt="BarStock"
              className="w-14 h-14"
            />
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

          {/* User Info & Logout */}
          <div className="mt-auto space-y-2">
            {user && (
              <div className="px-3 py-2 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-gray-700 truncate">
                  {user.nome}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            )}
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-gray-500 hover:bg-red-50 hover:text-red-700 w-full"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
            <a
              href="https://forms.gle/mMRy68gLFeq9XhSF6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-gray-500 hover:bg-purple-50 hover:text-purple-700 w-full"
            >
              <MessageSquare className="w-5 h-5" />
              Feedback
            </a>
            <Link
              to={createPageUrl("PlanStatus")}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full",
                plan === "PRO"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-500 hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              <Crown className="w-5 h-5" />
              <span>{plan === "PRO" ? "PRO" : "Free"}</span>
            </Link>
            <div className="px-3 py-2 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 text-center">BarStock v1.0</p>
            </div>
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
