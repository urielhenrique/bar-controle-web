export default function FormError({ message }) {
  if (!message) return null;

  return (
    <p
      style={{
        fontSize: "14px",
        color: "#ef4444",
        marginTop: "4px",
        fontWeight: "500",
      }}
    >
      {message}
    </p>
  );
}
