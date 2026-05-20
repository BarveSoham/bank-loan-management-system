type SidebarProps = {
  activeTab: string;
  setActiveTab: (
    tab: string
  ) => void;
};

export default function Sidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
    },

    {
      id: "customers",
      label: "Customers",
      icon: "👥",
    },

    {
      id: "loans",
      label: "Loans",
      icon: "💰",
    },

    {
      id: "calculator",
      label: "EMI Calculator",
      icon: "🧮",
    },

    {
      id: "reports",
      label: "Reports",
      icon: "📈",
    },
  ];

  return (
    <div
      style={{
        width: "240px",
        background: "#fff",
        borderRight: "1px solid #eee",
        padding: "20px",
        height: "100%",
        position: "sticky",
        top: 0,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() =>
            setActiveTab(tab.id)
          }
          style={{
            width: "100%",
            padding: "14px 18px",
            marginBottom: "10px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background:
              activeTab === tab.id
                ? "#1a5276"
                : "transparent",

            color:
              activeTab === tab.id
                ? "#fff"
                : "#555",

            display: "flex",
            alignItems: "center",
            gap: "12px",

            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}