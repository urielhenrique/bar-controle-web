export default function FormError({ message }) {
  if (!message) return null;

  return (
    <p
      style={{
        fontSize: "var(--font-size-sm)",
        color: "var(--color-error)",
        marginTop: "var(--spacing-xs)",
        fontWeight: "var(--font-weight-medium)",
      }}
    >
      {message}
    </p>
  );
}
