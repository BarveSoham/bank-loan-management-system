type StatCardProps = {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
};

export default function StatCard({
  icon,
  label,
  value,
  sub,
  color = "#1a5276",
}: StatCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e2",
        borderRadius: "16px",
        padding: "20px 24px",
        display: "flex",
        gap: "16px",
        alignItems: "center",
        boxShadow:
          "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div>
        <div
          style={{
            fontSize: "12px",
            color: "#888",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>

        {sub && (
          <div
            style={{
              fontSize: "12px",
              color: "#aaa",
              marginTop: "2px",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}