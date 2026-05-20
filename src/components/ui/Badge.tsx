type BadgeProps = {
  status: string;
};

export default function Badge({
  status,
}: BadgeProps) {
  const map: Record<
    string,
    {
      text: string;
      bg: string;
    }
  > = {
    active: {
      text: "#0d5c3a",
      bg: "#e6f9ef",
    },

    pending: {
      text: "#7a5c00",
      bg: "#fff8e1",
    },

    approved: {
      text: "#1a5276",
      bg: "#e8f4fd",
    },

    rejected: {
      text: "#c0392b",
      bg: "#fdecea",
    },

    closed: {
      text: "#444",
      bg: "#f0f0f0",
    },
  };

  const colors =
    map[status] || map.closed;

  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: "20px",
        background: colors.bg,
        color: colors.text,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {status}
    </span>
  );
}