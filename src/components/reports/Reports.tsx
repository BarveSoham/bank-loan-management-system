import StatCard from "../ui/StatCard";

type Customer = {
  id: string;
  score: number;
};

type Props = {
  customers: Customer[];
  loans: any[];
};

export default function Reports({
  customers,
  loans,
}: Props) {
  const totalPortfolio =
    loans.reduce(
      (total, loan) =>
        total +
        Number(loan.amount),
      0
    );
  const pendingLoans =
    loans.filter(
      (loan) =>
        loan.status === "pending"
    ).length;

  const approvedLoans =
    loans.filter(
      (loan) =>
        loan.status === "approved"
    ).length;

  const activeLoans =
    loans.filter(
      (loan) =>
        loan.status === "active"
    ).length;

  const rejectedLoans =
    loans.filter(
      (loan) =>
        loan.status === "rejected"
    ).length;

  const closedLoans =
    loans.filter(
      (loan) =>
        loan.status === "closed"
    ).length;

  const averageScore = Math.round(
    customers.reduce(
      (total, customer) =>
        total + customer.score,
      0
    ) / customers.length
  );

  const approvalRate =
    loans.length > 0
      ? Math.round(
        (approvedLoans /
          loans.length) *
        100
      )
      : 0;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
          }}
        >
          Reports
        </h1>

        <p
          style={{
            color: "#888",
            marginTop: "6px",
          }}
        >
          Banking analytics and
          portfolio insights
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",

          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          icon="💰"
          label="Total Portfolio"
          value={`₹${totalPortfolio.toLocaleString(
            "en-IN"
          )}`}
          sub="Across all loans"
        />

        <StatCard
          icon="⭐"
          label="Avg Credit Score"
          value={averageScore}
          sub="Across all customers"
          color="#1e8449"
        />

        <StatCard
          icon="👥"
          label="Customers"
          value={customers.length}
          sub="Active customers"
          color="#7d6608"
        />

        <StatCard
          icon="✅"
          label="Approval Rate"
          value={`${approvalRate}%`}
          sub="Successful approvals"
          color="#27ae60"
        />
      </div>

      {/* Analytics Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 2fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Loan Status Summary */}
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "24px",
            border:
              "1px solid #eee",

            boxShadow:
              "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              marginBottom: "22px",
            }}
          >
            Loan Status Summary
          </h2>

          {[
            {
              label: "Pending",
              value: pendingLoans,
              color: "#f39c12",
            },

            {
              label: "Approved",
              value: approvedLoans,
              color: "#3498db",
            },

            {
              label: "Active",
              value: activeLoans,
              color: "#27ae60",
            },

            {
              label: "Rejected",
              value: rejectedLoans,
              color: "#e74c3c",
            },

            {
              label: "Closed",
              value: closedLoans,
              color: "#7f8c8d",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom: "18px",
              }}
            >
              <span>
                {item.label}
              </span>

              <strong
                style={{
                  color: item.color,
                  fontSize: "18px",
                }}
              >
                {item.value}
              </strong>
            </div>
          ))}
        </div>

        {/* Loan Distribution */}
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "24px",
            border:
              "1px solid #eee",

            boxShadow:
              "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Loan Distribution
          </h2>

          {[
            "Home Loan",

            "Personal Loan",

            "Education Loan",

            "Business Loan",
          ].map((type) => {
            const count =
              loans.filter(
                (loan) =>
                  loan.type === type
              ).length;

            const percentage =
              loans.length > 0
                ? Math.round(
                  (count /
                    loans.length) *
                  100
                )
                : 0;

            return (
              <div
                key={type}
                style={{
                  marginBottom: "22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",

                    marginBottom: "8px",
                  }}
                >
                  <span>
                    {type}
                  </span>

                  <span>
                    {percentage}%
                  </span>
                </div>

                <div
                  style={{
                    height: "10px",
                    background:
                      "#f0f0f0",

                    borderRadius:
                      "20px",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      background:
                        "#1a5276",

                      borderRadius:
                        "20px",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}