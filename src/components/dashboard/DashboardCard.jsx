export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "24px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 200ms ease-in-out",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
        e.currentTarget.style.borderColor = "#4f46e5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginBottom: "8px",
              fontWeight: "500",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "4px",
              letterSpacing: "-0.025em",
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#eef2ff",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4f46e5",
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
