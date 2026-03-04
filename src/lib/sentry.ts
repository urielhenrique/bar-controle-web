import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react";

/**
 * Initialize Sentry for React frontend
 * Should be called as early as possible in main.tsx before rendering
 */
export const initSentry = () => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_ENVIRONMENT || "development";

  // Skip initialization if DSN is not provided
  if (!sentryDsn) {
    console.warn(
      "[Sentry] VITE_SENTRY_DSN not provided. Error monitoring disabled.",
    );
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment,
    // Set tracesSampleRate based on environment
    tracesSampleRate: environment === "production" ? 0.1 : 1.0,
    // Integrate with routing
    integrations: [
      browserTracingIntegration({
        // Set sampling rate for performance monitoring
        tracingOrigins: [
          "localhost",
          /^\//,
          // API endpoints
          /^https:\/\/api\./,
        ],
      }),
    ],
    // Capture breadcrumbs
    maxBreadcrumbs: environment === "production" ? 50 : 100,
    attachStacktrace: true,
    // Enable debug in development
    debug: environment !== "production",
  });

  // Set user context if available (from auth context)
  const getAuthUser = () => {
    try {
      const authData = sessionStorage.getItem("auth_user");
      if (authData) {
        const user = JSON.parse(authData);
        Sentry.setUser({
          id: user.id,
          email: user.email,
          // Never set sensitive data like passwords
        });
      }
    } catch (error) {
      // Silently fail if auth context is not available
    }
  };

  getAuthUser();

  console.log("[Sentry] Initialized successfully");
};

/**
 * Capture exception with context
 */
export const captureException = (error: any, context?: Record<string, any>) => {
  if (context) {
    Sentry.setContext("error_context", context);
  }
  Sentry.captureException(error);
};

/**
 * Capture message
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = "info",
) => {
  Sentry.captureMessage(message, level);
};

/**
 * Add breadcrumb for tracking
 */
export const addBreadcrumb = (
  message: string,
  category: string = "custom",
  level: Sentry.SeverityLevel = "info",
  data?: Record<string, any>,
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
};

/**
 * Add event processor for data sanitization
 * Strips sensitive data before sending to Sentry
 */
export const addSentryDataSanitization = () => {
  Sentry.addEventProcessor((event: Sentry.Event) => {
    // Remove sensitive headers from request
    if (event.request) {
      const sensitiveHeaders = [
        "authorization",
        "cookie",
        "x-csrf-token",
        "x-auth-token",
      ];

      sensitiveHeaders.forEach((header) => {
        if (event.request?.headers) {
          delete event.request.headers[header];
        }
      });

      // Remove sensitive query params
      if (event.request.url) {
        const url = new URL(event.request.url);
        const sensitiveParams = ["token", "password", "api_key", "secret"];
        sensitiveParams.forEach((param) => {
          url.searchParams.delete(param);
        });
        event.request.url = url.toString();
      }
    }

    // Remove sensitive data from request body
    if (event.request?.data) {
      const body = event.request.data as any;
      const sensitiveFields = [
        "password",
        "token",
        "jwt",
        "authorization",
        "stripe_token",
        "stripe_secret",
        "api_key",
        "secret_key",
        "credit_card",
        "card_number",
        "cvv",
        "ssn",
      ];

      sensitiveFields.forEach((field) => {
        if (body && field in body) {
          body[field] = "[REDACTED]";
        }
      });
    }

    // Remove sensitive data from context
    if (event.contexts) {
      const sensitiveContextFields = [
        "password",
        "token",
        "jwt",
        "authorization",
        "stripe_token",
        "credit_card",
      ];

      Object.keys(event.contexts).forEach((contextKey) => {
        const context = event.contexts?.[contextKey] as any;
        if (context && typeof context === "object") {
          sensitiveContextFields.forEach((field) => {
            if (field in context) {
              context[field] = "[REDACTED]";
            }
          });
        }
      });
    }

    return event;
  });
};

/**
 * Export Sentry for use in components
 */
export default Sentry;
