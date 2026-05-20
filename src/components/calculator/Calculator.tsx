import { useState } from "react";

export default function Calculator() {
  const [amount, setAmount] =
    useState(1000000);

  const [rate, setRate] =
    useState(10);

  const [months, setMonths] =
    useState(60);

  const presets = {
    Personal: 12,
    Home: 8.5,
    Auto: 9,
    Education: 7.5,
    Business: 14,
  };

  const monthlyRate =
    rate / 12 / 100;

  const emi = Math.round(
    (amount *
      monthlyRate *
      Math.pow(
        1 + monthlyRate,
        months
      )) /
      (Math.pow(
        1 + monthlyRate,
        months
      ) -
        1)
  );

  const totalPayment =
    emi * months;

  const totalInterest =
    totalPayment - amount;

  const principalPercent =
    Math.round(
      (amount /
        totalPayment) *
        100
    );

  const interestPercent =
    100 - principalPercent;

  return (
    <div
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "22px",
        }}
      >
        <h1
          style={{
            fontSize: "30px",
            fontWeight: 800,
            marginBottom: "4px",
          }}
        >
          EMI Calculator
        </h1>

        <p
          style={{
            color: "#888",
            fontSize: "15px",
          }}
        >
          Calculate EMI,
          interest and repayment
          schedules
        </p>
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",

          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            border:
              "1px solid #eee",

            boxShadow:
              "0 4px 10px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              marginBottom: "24px",
              fontWeight: 700,
            }}
          >
            Loan Parameters
          </h2>

          {/* Amount */}
          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",

                marginBottom: "10px",
                fontWeight: 600,
              }}
            >
              <span>
                Loan Amount
              </span>

              <span
                style={{
                  color: "#154c79",
                }}
              >
                ₹
                {amount.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={amount}
              onChange={(e) =>
                setAmount(
                  Number(
                    e.target.value
                  )
                )
              }
              style={{
                width: "100%",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",

                marginTop: "6px",
                color: "#aaa",
                fontSize: "13px",
              }}
            >
              <span>
                ₹50,000
              </span>

              <span>
                ₹50,00,000
              </span>
            </div>
          </div>

          {/* Interest */}
          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",

                marginBottom: "10px",
                fontWeight: 600,
              }}
            >
              <span>
                Interest Rate
              </span>

              <span
                style={{
                  color: "#154c79",
                }}
              >
                {rate}%
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="25"
              step="0.1"
              value={rate}
              onChange={(e) =>
                setRate(
                  Number(
                    e.target.value
                  )
                )
              }
              style={{
                width: "100%",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",

                marginTop: "6px",
                color: "#aaa",
                fontSize: "13px",
              }}
            >
              <span>5%</span>

              <span>25%</span>
            </div>
          </div>

          {/* Tenure */}
          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",

                marginBottom: "10px",
                fontWeight: 600,
              }}
            >
              <span>
                Tenure
              </span>

              <span
                style={{
                  color: "#154c79",
                }}
              >
                {months} months
              </span>
            </div>

            <input
              type="range"
              min="6"
              max="360"
              step="6"
              value={months}
              onChange={(e) =>
                setMonths(
                  Number(
                    e.target.value
                  )
                )
              }
              style={{
                width: "100%",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",

                marginTop: "6px",
                color: "#aaa",
                fontSize: "13px",
              }}
            >
              <span>
                6 months
              </span>

              <span>
                360 months
              </span>
            </div>
          </div>

          {/* Presets */}
          <div>
            <p
              style={{
                color: "#777",
                marginBottom: "12px",
                fontSize: "14px",
              }}
            >
              Quick Presets
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {Object.entries(
                presets
              ).map(
                ([name, value]) => (
                  <button
                    key={name}
                    onClick={() =>
                      setRate(value)
                    }
                    style={{
                      padding:
                        "8px 14px",

                      borderRadius:
                        "999px",

                      border:
                        "1px solid #ddd",

                      background:
                        "#fff",

                      cursor:
                        "pointer",

                      fontWeight: 600,

                      fontSize:
                        "13px",
                    }}
                  >
                    {name}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            display: "flex",
            flexDirection:
              "column",

            gap: "18px",
          }}
        >
          {/* EMI CARD */}
          <div
            style={{
              background:
                "#154c79",

              borderRadius: "20px",
              padding: "26px",
              color: "#fff",

              boxShadow:
                "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <p
              style={{
                opacity: 0.8,
                marginBottom: "12px",
                fontSize: "14px",
              }}
            >
              Monthly EMI
            </p>

            <h1
              style={{
                fontSize: "52px",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              ₹
              {emi.toLocaleString(
                "en-IN"
              )}
            </h1>

            <p
              style={{
                opacity: 0.8,
                fontSize: "14px",
              }}
            >
              for {months} months
            </p>
          </div>

          {/* SMALL CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",

              gap: "14px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "22px",
                border:
                  "1px solid #eee",
              }}
            >
              <p
                style={{
                  color: "#aaa",
                  marginBottom: "8px",
                  fontSize: "13px",
                }}
              >
                Total Interest
              </p>

              <h2
                style={{
                  color: "#d35400",
                  fontSize: "30px",
                  fontWeight: 800,
                }}
              >
                ₹
                {totalInterest.toLocaleString(
                  "en-IN"
                )}
              </h2>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "22px",
                border:
                  "1px solid #eee",
              }}
            >
              <p
                style={{
                  color: "#aaa",
                  marginBottom: "8px",
                  fontSize: "13px",
                }}
              >
                Total Payable
              </p>

              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                }}
              >
                ₹
                {totalPayment.toLocaleString(
                  "en-IN"
                )}
              </h2>
            </div>
          </div>

          {/* CHART */}
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              border:
                "1px solid #eee",

              display: "flex",
              flexDirection:
                "column",

              alignItems:
                "center",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius:
                  "50%",

                background: `conic-gradient(
                  #154c79 0% ${principalPercent}%,
                  #d35400 ${principalPercent}% 100%
                )`,

                display: "flex",
                alignItems:
                  "center",

                justifyContent:
                  "center",

                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius:
                    "50%",

                  background:
                    "#fff",

                  display: "flex",
                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                  }}
                >
                  {
                    principalPercent
                  }
                  %
                </h2>

                <p
                  style={{
                    color: "#999",
                    fontSize: "12px",
                  }}
                >
                  principal
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "20px",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",

                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    background:
                      "#154c79",

                    borderRadius:
                      "4px",
                  }}
                />

                <span>
                  Principal (
                  {
                    principalPercent
                  }
                  %)
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",

                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    background:
                      "#d35400",

                    borderRadius:
                      "4px",
                  }}
                />

                <span>
                  Interest (
                  {
                    interestPercent
                  }
                  %)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}