export default function MetricsGrid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "var(--spacing-lg)",
        marginBottom: "var(--spacing-xl)",
      }}
    >
      {children}
    </div>
  );
}
