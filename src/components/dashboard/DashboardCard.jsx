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
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "24px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 200ms ease-in-out",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
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
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "4px",
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p
              style={{
                fontSize: "12px",
                color: "#9ca3af",
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
              background: "#ecfdf5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10b981",
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
