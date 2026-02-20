import React from "react";
import PlanoStatusCard from "./PlanoStatusCard";

/**
 * Wrapper seguro para o PlanoStatusCard com error boundary
 * Evita que erros no componente quebre toda a aplicação
 */
class PlanoStatusCardErrorBoundary extends React.Component<
  { children?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Erro no PlanoStatusCard:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-yellow-600">⚠️</span>
            <p className="text-sm font-medium">
              Não foi possível carregar o status do plano
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tente recarregar a página
          </p>
        </div>
      );
    }

    return <PlanoStatusCard />;
  }
}

export default function PlanoSection() {
  return (
    <div className="mt-8">
      <PlanoStatusCardErrorBoundary />
    </div>
  );
}
