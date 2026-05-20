type InputProps = {
  label: string;
  value: string | number;
  onChange: (
    value: string
  ) => void;
  type?: string;
  placeholder?: string;
};

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: InputProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <label
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#555",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px 12px",
          fontSize: "14px",
        }}
      />
    </div>
  );
}