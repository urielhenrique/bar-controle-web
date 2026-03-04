import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as Sentry from "@sentry/react";
import { initSentry, addSentryDataSanitization } from "@/lib/sentry";
import App from "@/App.jsx";
import "@/index.css";

// Initialize Sentry before rendering
initSentry();
addSentryDataSanitization();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Create a Sentry-wrapped app
const SentryWrappedApp = () => (
  <Sentry.ErrorBoundary
    fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="max-w-md p-8 bg-slate-800 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-white mb-4">
            Oops! Algo deu errado
          </h1>
          <p className="text-slate-300 mb-6">
            Desculpe, encontramos um erro inesperado. Recarregue a página para
            tentar novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    }
  >
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </Sentry.ErrorBoundary>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <SentryWrappedApp />,
);
