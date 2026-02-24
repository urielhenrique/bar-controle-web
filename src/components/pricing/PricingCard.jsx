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
        background: "#ffffff",
        border: `2px solid ${isHighlighted ? "#10b981" : "#e5e7eb"}`,
        borderRadius: "12px",
        padding: "32px",
        boxShadow: isHighlighted 
          ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        position: "relative",
        transform: isHighlighted ? "scale(1.05)" : "scale(1)",
        transition: "all 200ms ease-in-out",
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
            background: "#10b981",
            color: "white",
            padding: "4px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          RECOMENDADO
        </div>
      )}

      <h3
        style={{
          fontSize: "20px",
          fontWeight: "700",
          marginBottom: "8px",
          color: "#1f2937",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
          marginBottom: "24px",
        }}
      >
        {description}
      </p>

      <div style={{ marginBottom: "24px" }}>
        <span
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1f2937",
          }}
        >
          {price}
        </span>
        {price !== "Grátis" && (
          <span
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginLeft: "8px",
            }}
          >
            / mês
          </span>
        )}
      </div>

      <button
        onClick={onUpgrade}
        style={{
          background: isHighlighted ? "#10b981" : "#e5e7eb",
          color: isHighlighted ? "white" : "#1f2937",
          padding: "16px 24px",
          border: "none",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer",
          width: "100%",
          marginBottom: "24px",
          transition: "all 150ms ease-in-out",
        }}
        onMouseEnter={(e) => {
          if (isHighlighted) {
            e.target.style.background = "#059669";
          } else {
            e.target.style.background = "#d1d5db";
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = isHighlighted ? "#10b981" : "#e5e7eb";
        }}
      >
        {buttonText}
      </button>

      <div
        style={{
          flex: 1,
          borderTop: "1px solid #e5e7eb",
          paddingTop: "24px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "16px",
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
                gap: "8px",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              <Check size={16} color="#10b981" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
