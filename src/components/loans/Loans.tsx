import { useState } from "react";
import axios from "axios";

import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Modal from "../ui/Model";

type Loan = {
  id: string;

  customer: string;

  type: string;

  amount: number;

  emi: string;

  applied: string;

  tenure: string;

  rate: string;

  status: string;

  icon: string;

  purpose?: string;

  collateral?: string;

  officerNote?: string;

  approvedOn?: string;

  disbursedOn?: string;

  creditScore?: number;

  income?: string;

  employer?: string;
};

type Customer = {
  id: string;

  name: string;

  email: string;

  phone: string;

  pan: string;

  income: string;

  employer: string;

  address: string;

  joined: string;

  loans: number;

  score: number;
};

type Props = {
  loans: Loan[];
  setLoans: any;
  customers: Customer[];
};

export default function Loans({
  loans,
  setLoans,
  customers,
}: Props) {
  const [activeFilter, setActiveFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [
    selectedLoan,
    setSelectedLoan,
  ] = useState<Loan | null>(
    null
  );

  const [
    showDetailsModal,
    setShowDetailsModal,
  ] = useState(false);

  const [
    showScheduleModal,
    setShowScheduleModal,
  ] = useState(false);

  const [customer, setCustomer] =
    useState("");

  const [type, setType] =
    useState("");

  const [rate, setRate] =
    useState("");

  const [amount, setAmount] =
    useState("");
  const [purpose, setPurpose] =
    useState("");

  const [collateral, setCollateral] =
    useState("");

  const [officerNote, setOfficerNote] =
    useState("");


  const filters = [
    {
      label: "All",
      count: loans.length,
    },

    {
      label: "Pending",
      count: loans.filter(
        (loan) =>
          loan.status === "pending"
      ).length,
    },

    {
      label: "Approved",
      count: loans.filter(
        (loan) =>
          loan.status === "approved"
      ).length,
    },

    {
      label: "Active",
      count: loans.filter(
        (loan) =>
          loan.status === "active"
      ).length,
    },

    {
      label: "Rejected",
      count: loans.filter(
        (loan) =>
          loan.status === "rejected"
      ).length,
    },

    {
      label: "Closed",
      count: loans.filter(
        (loan) =>
          loan.status === "closed"
      ).length,
    },
  ];

  const filteredLoans =
    activeFilter === "All"
      ? loans
      : loans.filter(
        (loan) =>
          loan.status.toLowerCase() ===
          activeFilter.toLowerCase()
      );

  const addLoan = async () => {

    if (
      !customer ||
      !type ||
      !amount
    ) {
      alert(
        "Please fill all fields"
      );

      return;
    }
    const selectedCustomerData =
      customers.find(
        (c) => c.name === customer
      );
    const newLoan = {
      id:
        "L00" +
        (loans.length + 1),

      customer,

      type,

      amount: Number(amount),

      emi: "₹12,000/mo",

      applied:
        new Date().toLocaleDateString(
          "en-IN"
        ),

      tenure: "60 months",

      rate,

      status: "pending",

      icon: "💰",

      purpose,
      collateral,
      officerNote,

      approvedOn: "—",

      disbursedOn: "—",

      creditScore:
        selectedCustomerData?.score || 0,

      income:
        selectedCustomerData?.income || "",

      employer:
        selectedCustomerData?.employer || "",

    };

    const response =
      await axios.post(
        "https://loanflow-backend.onrender.com/loans",

        newLoan
      );

    setLoans([
      ...loans,

      response.data,
    ]);

    setCustomer("");
    setType("");
    setAmount("");

    setShowModal(false);
  };
  const approveLoan =
    async (id: string) => {
      try {
        const updatedLoan =
          loans.find(
            (loan) =>
              loan.id === id
          );

        if (!updatedLoan)
          return;

        const response =
          await axios.put(
            `https://loanflow-backend.onrender.com/loans/${id}`,

            {
              status:
                "approved",

              approvedOn:
                new Date().toLocaleDateString(
                  "en-IN"
                ),

              disbursedOn:
                updatedLoan.disbursedOn ||
                "—",
            }
          );

        setLoans(
          loans.map((loan) =>
            loan.id === id
              ? {
                ...loan,

                ...response.data,
              }
              : loan
          )
        );

        setShowDetailsModal(
          false
        );
      } catch (error) {
        console.error(error);
      }
    };
  const rejectLoan = (
    id: string
  ) => {
    setLoans(
      loans.map((loan) =>
        loan.id === id
          ? {
            ...loan,
            status:
              "rejected",
          }
          : loan
      )
    );
    setShowDetailsModal(false);
  };

  const disburseLoan = (
    id: string
  ) => {
    setLoans(
      loans.map((loan) =>
        loan.id === id
          ? {
            ...loan,
            status:
              "active",
          }
          : loan
      )
    );
    setShowDetailsModal(false);
  };

  const closeLoan = (
    id: string
  ) => {
    setLoans(
      loans.map((loan) =>
        loan.id === id
          ? {
            ...loan,
            status:
              "closed",
          }
          : loan
      )
    );
    setShowDetailsModal(false);
  };

  const deleteLoan =
    async (id: string) => {
      try {
        await axios.delete(
          `https://loanflow-backend.onrender.com/loans/${id}`
        );

        setLoans(
          loans.filter(
            (loan) =>
              loan.id !== id
          )
        );

        setShowDetailsModal(
          false
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            Loans
          </h1>

          <p
            style={{
              color: "#888",
              marginTop: "6px",
            }}
          >
            Process loan
            applications and
            approvals
          </p>
        </div>

        <Button
          onClick={() =>
            setShowModal(true)
          }
        >
          + Apply Loan
        </Button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() =>
              setActiveFilter(
                filter.label
              )
            }
            style={{
              padding: "10px 18px",

              borderRadius: "999px",

              border:
                activeFilter ===
                  filter.label
                  ? "none"
                  : "1px solid #ddd",

              background:
                activeFilter ===
                  filter.label
                  ? "#1a5276"
                  : "#fff",

              color:
                activeFilter ===
                  filter.label
                  ? "#fff"
                  : "#555",

              cursor: "pointer",

              fontWeight: 600,

              fontSize: "14px",
            }}
          >
            {filter.label} (
            {filter.count})
          </button>
        ))}
      </div>

      {/* Loan Cards */}
      <div
        style={{
          display: "flex",
          flexDirection:
            "column",

          gap: "20px",
        }}
      >
        {filteredLoans.map(
          (loan) => (
            <div
              key={loan.id}
              style={{
                background: "#fff",

                borderRadius:
                  "20px",

                padding: "18px",

                border:
                  "1px solid #eee",

                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",

                  gap: "22px",
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",

                    borderRadius:
                      "18px",

                    background:
                      "#edf3f8",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    fontSize:
                      "28px",
                  }}
                >
                  {loan.icon}
                </div>

                <div>
                  <div
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: "14px",

                      marginBottom:
                        "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "24px",

                        fontWeight: 800,

                        color:
                          "#1a5276",
                      }}
                    >
                      {loan.id}
                    </div>

                    <div>
                      •
                    </div>

                    <div
                      style={{
                        fontSize:
                          "18px",
                      }}
                    >
                      {loan.type}
                    </div>

                    <Badge
                      status={
                        loan.status
                      }
                    />
                  </div>

                  <div
                    style={{
                      color: "#666",
                    }}
                  >
                    {loan.customer}
                    {" • "}
                    Applied{" "}
                    {
                      loan.applied
                    }
                    {" • "}
                    {
                      loan.tenure
                    }
                    {" • "}
                    {loan.rate} p.a.
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign:
                    "center",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "28px",

                    fontWeight: 800,

                    marginBottom:
                      "6px",
                  }}
                >
                  ₹{Number(
                    loan.amount
                  ).toLocaleString("en-IN")}
                </div>

                <div
                  style={{
                    color: "#777",

                    marginBottom:
                      "12px",
                  }}
                >
                  EMI {loan.emi}
                </div>

                <div
                  style={{
                    display:
                      "flex",

                    gap: "12px",

                    justifyContent:
                      "center",
                  }}
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedLoan(loan);

                      setShowDetailsModal(
                        true
                      );
                    }}
                  >
                    Details
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedLoan(loan);

                      setShowScheduleModal(
                        true
                      );
                    }}
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <Modal
          title="New Loan Application"
          onClose={() =>
            setShowModal(false)
          }
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",

              gap: "22px",
            }}
          >
            <div
              style={{
                gridColumn:
                  "1 / span 2",
              }}
            >
              <label>
                CUSTOMER *
              </label>

              <select
                value={customer}
                onChange={(e) =>
                  setCustomer(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  border:
                    "1px solid #ddd",

                  borderRadius: "12px",
                }}
              >
                <option value="">
                  Select...
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={
                        customer.id
                      }
                      value={
                        customer.name
                      }
                    >
                      {
                        customer.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label>
                LOAN TYPE *
              </label>

              <select
                value={type}
                onChange={(e) => {
                  const selectedType =
                    e.target.value;

                  setType(selectedType);

                  if (
                    selectedType ===
                    "Home Loan"
                  ) {
                    setRate("8.5%");
                  }

                  else if (
                    selectedType ===
                    "Personal Loan"
                  ) {
                    setRate("12%");
                  }

                  else if (
                    selectedType ===
                    "Vehicle Loan"
                  ) {
                    setRate("9%");
                  }

                  else if (
                    selectedType ===
                    "Gold Loan"
                  ) {
                    setRate("7.5%");
                  }

                  else if (
                    selectedType ===
                    "Business Loan"
                  ) {
                    setRate("14%");
                  }

                  else if (
                    selectedType ===
                    "Education Loan"
                  ) {
                    setRate("6.5%");
                  }
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  border:
                    "1px solid #ddd",

                  borderRadius: "12px",
                }}
              >
                <option value="">
                  Select...
                </option>

                <option>
                  Home Loan
                </option>

                <option>
                  Personal Loan
                </option>

                <option>
                  Vehicle Loan
                </option>

                <option>
                  Gold Loan
                </option>

                <option>
                  Business Loan
                </option>
              </select>
            </div>

            <div>
              <label>
                LOAN AMOUNT *
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                placeholder="e.g. 500000"
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  border:
                    "1px solid #ddd",

                  borderRadius: "12px",
                }}
              />
            </div>
          </div>
          {/* Tenure */}
          <div>
            <label>
              TENURE (MONTHS) *
            </label>

            <select
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "8px",
                border:
                  "1px solid #ddd",

                borderRadius: "12px",
              }}
            >
              <option value="">
                Select...
              </option>

              <option>
                12 Months
              </option>

              <option>
                24 Months
              </option>

              <option>
                36 Months
              </option>

              <option>
                60 Months
              </option>

              <option>
                120 Months
              </option>

              <option>
                240 Months
              </option>
            </select>
          </div>

          {/* Interest Rate */}
          <div>
            <label>
              INTEREST RATE
            </label>

            <input
              type="text"
              value={rate}
              readOnly
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "8px",
                border:
                  "1px solid #ddd",

                borderRadius: "12px",

                background: "#f5f7fa",

                color: "#154c79",

                fontWeight: 600,
              }}
            />
          </div>

          {/* Collateral */}
          <div>
            <label>
              COLLATERAL
            </label>

            <input
              type="text"
              value={collateral}
              onChange={(e) =>
                setCollateral(
                  e.target.value
                )
              }
              placeholder="e.g. Property deed"
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "8px",
                border:
                  "1px solid #ddd",

                borderRadius: "12px",
              }}
            />
          </div>

          {/* Loan Purpose */}
          <div
            style={{
              gridColumn:
                "1 / span 2",
            }}
          >
            <label>
              LOAN PURPOSE *
            </label>

            <textarea
              rows={4}
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value)
              }
              placeholder="Describe the purpose of this loan..."
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "8px",
                border:
                  "1px solid #ddd",

                borderRadius: "12px",

                resize: "none",
              }}
            />
          </div>

          {/* Officer Notes */}
          <div
            style={{
              gridColumn:
                "1 / span 2",
            }}
          >
            <label>
              OFFICER NOTES
            </label>

            <textarea
              rows={4}
              value={officerNote}
              onChange={(e) =>
                setOfficerNote(
                  e.target.value
                )
              }
              placeholder="Internal notes..."
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "8px",
                border:
                  "1px solid #ddd",

                borderRadius: "12px",

                resize: "none",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",

              gap: "14px",
              marginTop: "30px",
            }}
          >
            <button
              onClick={() =>
                setShowModal(false)
              }
              style={{
                padding:
                  "12px 24px",

                borderRadius:
                  "12px",

                border:
                  "1px solid #ddd",

                background: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              onClick={addLoan}
              style={{
                padding:
                  "12px 26px",

                borderRadius:
                  "12px",

                border: "none",

                background:
                  "#154c79",

                color: "#fff",
                cursor: "pointer",
              }}
            >
              Create Loan
            </button>
          </div>
        </Modal>
      )}

      {/* DETAILS MODAL */}
      {showDetailsModal &&
        selectedLoan && (
          <Modal
            title="Loan Details"
            onClose={() =>
              setShowDetailsModal(false)
            }
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr 1fr",

                gap: "14px",

                marginBottom: "20px",
              }}
            >
              {[
                [
                  "Loan Amount",
                  `₹${selectedLoan.amount.toLocaleString(
                    "en-IN"
                  )}`,
                ],

                [
                  "Interest Rate",
                  selectedLoan.rate,
                ],

                [
                  "Tenure",
                  selectedLoan.tenure,
                ],

                [
                  "Monthly EMI",
                  selectedLoan.emi,
                ],

                [
                  "Loan Type",
                  selectedLoan.type,
                ],

                [
                  "Status",
                  selectedLoan.status.toUpperCase(),
                ],

                [
                  "Applied On",
                  selectedLoan.applied,
                ],

                [
                  "Approved On",
                  selectedLoan.approvedOn ||
                  "—",
                ],

                [
                  "Disbursed On",
                  selectedLoan.disbursedOn ||
                  "—",
                ],
              ].map(([k, v]) => (
                <div
                  key={String(k)}
                  style={{
                    background: "#f8f8f8",

                    borderRadius: "12px",

                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",

                      color: "#999",

                      textTransform:
                        "uppercase",

                      marginBottom: "6px",
                    }}
                  >
                    {k}
                  </div>

                  <div
                    style={{
                      fontWeight: 700,

                      fontSize: "15px",
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>

            {/* PURPOSE */}
            <div
              style={{
                background: "#f8f8f8",

                padding: "16px",

                borderRadius: "12px",

                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",

                  color: "#999",

                  marginBottom: "6px",

                  textTransform:
                    "uppercase",
                }}
              >
                Purpose
              </div>

              <div>
                {selectedLoan.purpose}
              </div>
            </div>

            {/* COLLATERAL */}
            <div
              style={{
                background: "#f8f8f8",

                padding: "16px",

                borderRadius: "12px",

                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",

                  color: "#999",

                  marginBottom: "6px",

                  textTransform:
                    "uppercase",
                }}
              >
                Collateral
              </div>

              <div>
                {
                  selectedLoan.collateral
                }
              </div>
            </div>

            {/* OFFICER NOTE */}
            <div
              style={{
                background: "#fff8db",

                border:
                  "1px solid #f1d76a",

                padding: "16px",

                borderRadius: "12px",

                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",

                  color: "#8a6d00",

                  marginBottom: "6px",

                  textTransform:
                    "uppercase",
                }}
              >
                Officer Note
              </div>

              <div>
                {
                  selectedLoan.officerNote
                }
              </div>
            </div>

            {/* CUSTOMER FINANCIALS */}
            <div
              style={{
                background: "#e8f1fb",

                borderRadius: "12px",

                padding: "18px",

                display: "flex",

                justifyContent:
                  "space-between",

                marginBottom: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",

                    color: "#4b6584",

                    marginBottom: "6px",
                  }}
                >
                  CREDIT SCORE
                </div>

                <div
                  style={{
                    fontWeight: 800,

                    fontSize: "28px",
                  }}
                >
                  {
                    selectedLoan.creditScore
                  }
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "11px",

                    color: "#4b6584",

                    marginBottom: "6px",
                  }}
                >
                  ANNUAL INCOME
                </div>

                <div
                  style={{
                    fontWeight: 700,

                    fontSize: "22px",
                  }}
                >
                  {
                    selectedLoan.income
                  }
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "11px",

                    color: "#4b6584",

                    marginBottom: "6px",
                  }}
                >
                  EMPLOYER
                </div>

                <div
                  style={{
                    fontWeight: 700,

                    fontSize: "20px",
                  }}
                >
                  {
                    selectedLoan.employer
                  }
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              {selectedLoan.status ===
                "pending" && (
                  <>
                    <Button
                      onClick={() =>
                        approveLoan(
                          selectedLoan.id
                        )
                      }
                    >
                      Approve
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() =>
                        rejectLoan(
                          selectedLoan.id
                        )
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}

              {selectedLoan.status ===
                "approved" && (
                  <Button
                    onClick={() =>
                      disburseLoan(
                        selectedLoan.id
                      )
                    }
                  >
                    Disburse
                  </Button>
                )}

              {selectedLoan.status ===
                "active" && (
                  <Button
                    variant="danger"
                    onClick={() =>
                      closeLoan(
                        selectedLoan.id
                      )
                    }
                  >
                    Close Loan
                  </Button>

                )}
              <Button
                variant="danger"
                onClick={() =>
                  deleteLoan(
                    selectedLoan.id
                  )
                }
              >
                Delete Loan
              </Button>
            </div>
          </Modal>
        )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal &&
        selectedLoan && (
          <Modal
            title="Repayment Schedule"
            onClose={() =>
              setShowScheduleModal(false)
            }
          >
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
                    "Month",
                    "EMI",
                    "Principal",
                    "Interest",
                  ].map((item) => (
                    <th
                      key={item}
                      style={{
                        padding:
                          "12px",

                        textAlign:
                          "left",

                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {(() => {
                  const principal =
                    selectedLoan.amount;

                  const months = parseInt(
                    selectedLoan.tenure
                  );

                  const annualRate =
                    parseFloat(
                      selectedLoan.rate
                    );

                  const monthlyRate =
                    annualRate / 12 / 100;

                  const emi =
                    parseFloat(
                      selectedLoan.emi.replace(
                        /[^0-9]/g,
                        ""
                      )
                    );

                  let balance =
                    principal;

                  return Array.from({
                    length: months > 12
                      ? 12
                      : months,
                  }).map((_, index) => {
                    const interest =
                      balance *
                      monthlyRate;

                    const principalPaid =
                      emi - interest;

                    balance =
                      balance -
                      principalPaid;

                    return (
                      <tr key={index}>
                        <td
                          style={{
                            padding:
                              "12px",
                          }}
                        >
                          Month{" "}
                          {index + 1}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px",
                          }}
                        >
                          ₹
                          {Math.round(
                            emi
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px",
                          }}
                        >
                          ₹
                          {Math.round(
                            principalPaid
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px",
                          }}
                        >
                          ₹
                          {Math.round(
                            interest
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </Modal>
        )}

    </div>
  );
}