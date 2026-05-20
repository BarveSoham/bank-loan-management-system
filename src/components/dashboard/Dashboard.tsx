import StatCard from "../ui/StatCard";
import Badge from "../ui/Badge";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  income: string;
  joined: string;
  loans: number;
  score: number;
};

type Props = {
  customers: Customer[];
  loans: any[];
};



export default function Dashboard({
  customers,
  loans,
}: Props) {
  return (
    <div>
      {/* Heading */}
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
          Dashboard
        </h1>

        <p
          style={{
            color: "#888",
            marginTop: "6px",
          }}
        >
          Overview of loan
          portfolio and recent
          activity
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",

          gap: "20px",

          marginBottom: "35px",
        }}
      >
        <StatCard
          icon="👥"
          label="Total Customers"
          value={customers.length}
          sub={`${customers.length} registered customers`}
        />

        <StatCard
          icon="📋"
          label="Total Loans"
          value={loans.length}
          sub="Active customer loans"
        />

        <StatCard
          icon="💰"
          label="Disbursed Portfolio"
          value={`₹${loans
            .reduce(
              (sum, loan) =>
                sum + Number(loan.amount),
              0
            )
            .toLocaleString("en-IN")}`}
        />

        <StatCard
          icon="⏳"
          label="Pending Approvals"
          value={
            loans.filter(
              (loan) =>
                loan.status ===
                "pending"
            ).length
          }
          sub="Awaiting review"
          color="#922b21"
        />
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",

          gap: "24px",
        }}
      >
        {/* Recent Loans */}
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "28px",
            border:
              "1px solid #eee",
          }}
        >
          <h2
            style={{
              marginBottom: "24px",
            }}
          >
            Recent Loan
            Applications
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                {[
                  "Loan ID",
                  "Customer",
                  "Type",
                  "Amount",
                  "Applied",
                  "Status",
                ].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign:
                        "left",

                      padding:
                        "14px 12px",

                      color:
                        "#777",

                      fontSize:
                        "12px",

                      textTransform:
                        "uppercase",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loans
                .slice(-3)
                .reverse()
                .map(
                  (loan) => (
                    <tr
                      key={loan.id}
                      style={{
                        borderTop:
                          "1px solid #f0f0f0",
                      }}
                    >
                      <td
                        style={{
                          padding:
                            "16px 12px",

                          fontWeight: 700,

                          color:
                            "#1a5276",
                        }}
                      >
                        {loan.id}
                      </td>

                      <td
                        style={{
                          padding:
                            "16px 12px",
                        }}
                      >
                        {
                          loan.customer
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "16px 12px",
                        }}
                      >
                        {loan.type}
                      </td>

                      <td
                        style={{
                          padding:
                            "16px 12px",

                          fontWeight: 600,
                        }}
                      >
                        ₹{Number(
                          loan.amount
                        ).toLocaleString("en-IN")}
                      </td>

                      <td
                        style={{
                          padding:
                            "16px 12px",

                          color:
                            "#777",
                        }}
                      >
                        {
                          loan.applied
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "16px 12px",
                        }}
                      >
                        <Badge
                          status={
                            loan.status
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div
          style={{
            display: "flex",
            flexDirection:
              "column",

            gap: "24px",
          }}
        >
          {/* Portfolio */}
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "28px",
              border: "1px solid #eee",
              minHeight: "100%",
            }}
          >
            <h2
              style={{
                marginBottom: "24px",
              }}
            >
              Loan Portfolio
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
                  ? (count /
                    loans.length) *
                  100
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
                    <span>{type}</span>

                    <span>{count}</span>
                  </div>

                  <div
                    style={{
                      height: "8px",

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
    </div>
  );
}