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
        background: "var(--color-bg-primary)",
        border: `1px solid var(--color-border)`,
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-lg)",
        cursor: onClick ? "pointer" : "default",
        transition: "all var(--transition-normal)",
        boxShadow: "var(--shadow-xs)",
      }}
      className="hover:shadow-md"
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
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--spacing-sm)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: "var(--font-size-3xl)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-xs)",
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-muted)",
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
              background: "var(--color-accent-light)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-accent-primary)",
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
