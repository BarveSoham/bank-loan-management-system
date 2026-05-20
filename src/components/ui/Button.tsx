type Props = {
  children: React.ReactNode;

  variant?: string;

  onClick?: () => void;

  type?: "button" | "submit";
};

export default function Button({
  children,
  variant,
  onClick,
  type = "button",
}: Props) {
  const styles: Record<
    string,
    React.CSSProperties
  > = {
    primary: {
      background:
        "linear-gradient(135deg,#1a5276,#2471a3)",
      color: "#fff",
    },

    success: {
      background:
        "linear-gradient(135deg,#1e8449,#27ae60)",
      color: "#fff",
    },

    danger: {
      background:
        "linear-gradient(135deg,#922b21,#c0392b)",
      color: "#fff",
    },

    outline: {
      background: "#fff",

      color: "#2c3e50",

      border:
        "1px solid #dcdcdc",
    },
  };

  return (
    <button
      onClick={onClick}
      type={type}
      style={{
        ...styles[
        variant || "primary"
        ],

        padding: "10px 18px",

        borderRadius: "12px",

        border:
          variant === "outline"
            ? "1px solid #d6d6d6"
            : "none",

        cursor: "pointer",

        fontWeight: 600,

        fontSize: "14px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        transition:
          "all 0.2s ease",

        boxShadow:
          variant !== "outline"
            ? "0 4px 12px rgba(0,0,0,0.08)"
            : "none",

      }}
    >
      {children}
    </button>
  );
}