import { Check } from "lucide-react";

export default function PricingCard({
  title,
  price,
  description,
  features,
  isHighlighted,
  onUpgrade,
  buttonText = "Escolher Plano",
}) {
  return (
    <div
      style={{
        background: "var(--color-bg-primary)",
        border: `2px solid ${isHighlighted ? "var(--color-accent-primary)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-xl)",
        boxShadow: isHighlighted ? "var(--shadow-lg)" : "var(--shadow-sm)",
        position: "relative",
        transform: isHighlighted ? "scale(1.05)" : "scale(1)",
        transition: "all var(--transition-normal)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isHighlighted && (
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "20px",
            background: "var(--color-accent-primary)",
            color: "white",
            padding: "4px 12px",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-size-xs)",
            fontWeight: "var(--font-weight-bold)",
            textTransform: "uppercase",
          }}
        >
          RECOMENDADO
        </div>
      )}

      <h3
        style={{
          fontSize: "var(--font-size-xl)",
          fontWeight: "var(--font-weight-bold)",
          marginBottom: "var(--spacing-sm)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "var(--font-size-sm)",
          color: "var(--color-text-secondary)",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        {description}
      </p>

      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <span
          style={{
            fontSize: "var(--font-size-3xl)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text-primary)",
          }}
        >
          {price}
        </span>
        {price !== "Grátis" && (
          <span
            style={{
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
              marginLeft: "var(--spacing-sm)",
            }}
          >
            / mês
          </span>
        )}
      </div>

      <button
        onClick={onUpgrade}
        style={{
          background: isHighlighted
            ? "var(--color-accent-primary)"
            : "var(--color-border)",
          color: isHighlighted ? "white" : "var(--color-text-primary)",
          padding: "var(--spacing-md) var(--spacing-lg)",
          border: "none",
          borderRadius: "var(--radius-md)",
          fontWeight: "var(--font-weight-semibold)",
          cursor: "pointer",
          width: "100%",
          marginBottom: "var(--spacing-lg)",
          transition: "all var(--transition-fast)",
        }}
      >
        {buttonText}
      </button>

      <div
        style={{
          flex: 1,
          borderTop: `1px solid var(--color-border)`,
          paddingTop: "var(--spacing-lg)",
        }}
      >
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          Incluso:
        </p>
        <ul>
          {features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
                marginBottom: "var(--spacing-sm)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              <Check size={16} color="var(--color-accent-primary)" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
