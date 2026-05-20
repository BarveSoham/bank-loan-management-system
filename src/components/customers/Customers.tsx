import React, { useState } from "react";
import axios from "axios";

import Button from "../ui/Button";
import Modal from "../ui/Model";

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
  customers: Customer[];

  setCustomers: React.Dispatch<
    React.SetStateAction<Customer[]>
  >;
};

export default function Customers({
  customers,
  setCustomers,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);
  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState<Customer | null>(
    null
  );

  const [
    showViewModal,
    setShowViewModal,
  ] = useState(false);

  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [pan, setPan] =
    useState("");

  const [income, setIncome] =
    useState("");

  const [employer, setEmployer] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [score, setScore] =
    useState(750);

  const filteredCustomers =
    customers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const addCustomer = async () => {
    try {
      const newCustomer = {
        name,

        email,

        phone,

        pan,

        income,

        employer,

        address,

        joined:
          new Date().toLocaleDateString(
            "en-IN"
          ),

        loans: 0,

        score:
          Math.floor(
            Math.random() * 100
          ) + 700,
      };

      const response =
        await axios.post(
          "http://localhost:5000/customers",

          newCustomer
        );

      setCustomers([
        ...customers,

        response.data,
      ]);

      setShowModal(false);

      setName("");
      setEmail("");
      setPhone("");
      setPan("");
      setIncome("");
      setEmployer("");
      setAddress("");
    } catch (error) {
      console.error(error);

      alert(
        "Failed to add customer"
      );
    }
  };

  const deleteCustomer =
    async (id: string) => {
      try {
        await axios.delete(
          `http://localhost:5000/customers/${id}`
        );

        setCustomers(
          customers.filter(
            (customer) =>
              customer.id !== id
          )
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
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            Customers
          </h1>

          <p
            style={{
              color: "#888",
              marginTop: "6px",
            }}
          >
            Manage customer
            records and profiles
          </p>
        </div>

        <Button
          onClick={() =>
            setShowModal(true)
          }
        >
          + Add Customer
        </Button>
      </div>

      {/* Search */}
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            width: "320px",
            padding:
              "12px 16px",

            border:
              "1px solid #ddd",

            borderRadius:
              "12px",

            fontSize: "14px",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          overflow: "hidden",
          border:
            "1px solid #eee",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead
            style={{
              background: "#f9fafb",
            }}
          >
            <tr>
              {[
                "Customer ID",
                "NAME",
                "Phone",
                "PAN",
                "Income",
                "Joined",
                "Loans",
                "Credit Score",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  style={{
                    padding:
                      "18px 20px",

                    textAlign:
                      head === "Actions" ||
                        head === "Loans"
                        ? "center"
                        : "left",

                    fontSize: "12px",

                    color: "#666",

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
            {filteredCustomers.map(
              (customer) => (
                <tr
                  key={
                    customer.id
                  }
                  style={{
                    borderTop:
                      "1px solid #f0f0f0",
                  }}
                >
                  {/* Customer ID */}
                  <td
                    style={{
                      padding: "20px",
                      fontWeight: 700,
                      color: "#1a5276",
                    }}
                  >
                    {customer.id}
                  </td>

                  {/* Customer */}
                  <td
                    style={{
                      padding:
                        "20px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      {
                        customer.name
                      }
                    </div>

                    <div
                      style={{
                        color:
                          "#777",

                        fontSize:
                          "13px",

                        marginTop:
                          "4px",
                      }}
                    >
                      {
                        customer.email
                      }
                    </div>
                  </td>

                  {/* Phone */}
                  <td
                    style={{
                      padding: "20px",
                    }}
                  >
                    {customer.phone}
                  </td>

                  {/* PAN */}
                  <td
                    style={{
                      padding:
                        "20px",
                    }}
                  >
                    {customer.pan}
                  </td>

                  {/* Income */}
                  <td
                    style={{
                      padding:
                        "20px",

                      fontWeight: 600,
                    }}
                  >
                    {
                      customer.income
                    }
                  </td>

                  {/* Joined */}
                  <td
                    style={{
                      padding:
                        "20px",

                      color:
                        "#777",
                    }}
                  >
                    {
                      customer.joined
                    }
                  </td>

                  {/* Loans */}
                  <td
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {customer.loans}
                  </td>

                  {/* Score */}
                  <td
                    style={{
                      padding:
                        "20px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,

                        color:
                          customer.score >
                            750
                            ? "#1e8449"
                            : "#d68910",

                        marginBottom:
                          "8px",
                      }}
                    >
                      {
                        customer.score
                      }
                    </div>

                    <div
                      style={{
                        width:
                          "100px",

                        height:
                          "6px",

                        background:
                          "#eee",

                        borderRadius:
                          "20px",
                      }}
                    >
                      <div
                        style={{
                          width: `${customer.score / 10}%`,

                          height:
                            "100%",

                          background:
                            customer.score >
                              750
                              ? "#27ae60"
                              : "#f39c12",

                          borderRadius:
                            "20px",
                        }}
                      />
                    </div>
                  </td>

                  {/* Actions */}
                  <td
                    style={{
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        gap: "10px",

                        alignItems: "center",

                        justifyContent: "center",

                      }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCustomer(
                            customer
                          );

                          setShowViewModal(true);
                        }}
                      >
                        View
                      </Button>

                      <Button
                        onClick={() => {
                          setSelectedCustomer(
                            customer
                          );

                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>

                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {
        showModal && (
          <Modal
            title="Add New Customer"
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
              {/* Full Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom:
                      "8px",

                    fontSize:
                      "14px",

                    fontWeight: 600,
                  }}
                >
                  FULL NAME *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    fontSize: "15px",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom:
                      "8px",

                    fontSize:
                      "14px",

                    fontWeight: 600,
                  }}
                >
                  EMAIL *
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    fontSize: "15px",
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom:
                      "8px",

                    fontSize:
                      "14px",

                    fontWeight: 600,
                  }}
                >
                  PHONE *
                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    fontSize: "15px",
                  }}
                />
              </div>

              {/* PAN */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom:
                      "8px",

                    fontSize:
                      "14px",

                    fontWeight: 600,
                  }}
                >
                  PAN NUMBER
                </label>

                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={pan}
                  onChange={(e) =>
                    setPan(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    fontSize: "15px",
                  }}
                />
              </div>

              {/* Credit Score */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom:
                      "8px",

                    fontSize:
                      "14px",

                    fontWeight: 600,
                  }}
                >
                  CREDIT SCORE
                </label>

                <input
                  type="number"
                  placeholder="300-900"
                  value={score}
                  onChange={(e) =>
                    setScore(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    fontSize: "15px",
                  }}
                />
              </div>

              {/* Income */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom:
                      "8px",

                    fontSize:
                      "14px",

                    fontWeight: 600,
                  }}
                >
                  ANNUAL INCOME
                </label>

                <input
                  type="text"
                  value={income}
                  onChange={(e) =>
                    setIncome(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    fontSize: "15px",
                  }}
                />
              </div>

              {/* Employer */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom:
                      "8px",

                    fontSize:
                      "14px",

                    fontWeight: 600,
                  }}
                >
                  EMPLOYER
                </label>

                <input
                  type="text"
                  value={employer}
                  onChange={(e) =>
                    setEmployer(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    fontSize: "15px",
                  }}
                />
              </div>

              {/* Address */}
              <div
                style={{
                  gridColumn:
                    "1 / span 2",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom:
                      "8px",

                    fontSize:
                      "14px",

                    fontWeight: 600,
                  }}
                >
                  ADDRESS
                </label>

                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    fontSize: "15px",
                    resize: "none",
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",

                gap: "12px",

                alignItems: "center",

                flexWrap: "nowrap",
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

                  background:
                    "#fff",

                  cursor:
                    "pointer",

                  fontWeight: 600,
                }}
              >
                Cancel
              </button>

              <button
                onClick={addCustomer}
                style={{
                  padding:
                    "12px 26px",

                  borderRadius:
                    "12px",

                  border: "none",

                  background:
                    "#154c79",

                  color: "#fff",

                  cursor:
                    "pointer",

                  fontWeight: 600,
                }}
              >
                Add Customer
              </button>
            </div>
          </Modal>
        )
      }

      {/* VIEW MODAL */}
      {
        showViewModal &&
        selectedCustomer && (
          <Modal
            title="Customer Details"
            onClose={() =>
              setShowViewModal(false)
            }
          >
            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              <div>
                <strong>Name:</strong>{" "}
                {
                  selectedCustomer.name
                }
              </div>

              <div>
                <strong>Email:</strong>{" "}
                {
                  selectedCustomer.email
                }
              </div>

              <div>
                <strong>Phone:</strong>{" "}
                {
                  selectedCustomer.phone
                }
              </div>

              <div>
                <strong>PAN:</strong>{" "}
                {
                  selectedCustomer.pan
                }
              </div>

              <div>
                <strong>Income:</strong>{" "}
                {
                  selectedCustomer.income
                }
              </div>

              <div>
                <strong>Employer:</strong>{" "}
                {
                  selectedCustomer.employer
                }
              </div>

              <div>
                <strong>Address:</strong>{" "}
                {
                  selectedCustomer.address
                }
              </div>

              <div>
                <strong>Credit Score:</strong>{" "}
                {
                  selectedCustomer.score
                }
              </div>
            </div>
            <div
              style={{
                display: "flex",

                justifyContent:
                  "flex-end",

                marginTop: "28px",
              }}
            >
              <Button
                variant="danger"
                onClick={() => {
                  deleteCustomer(
                    selectedCustomer.id
                  );

                  setShowViewModal(
                    false
                  );
                }}
              >
                Delete Customer
              </Button>
            </div>
          </Modal>
        )
      }

      {/* EDIT MODAL */}
      {
        showEditModal &&
        selectedCustomer && (
          <Modal
            title="Edit Customer"
            onClose={() =>
              setShowEditModal(false)
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
              {/* Full Name */}
              <div>
                <label>
                  FULL NAME
                </label>

                <input
                  type="text"
                  value={
                    selectedCustomer.name
                  }
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      name:
                        e.target
                          .value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label>EMAIL</label>

                <input
                  type="email"
                  value={
                    selectedCustomer.email
                  }
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      email:
                        e.target
                          .value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <label>PHONE</label>

                <input
                  type="text"
                  value={
                    selectedCustomer.phone
                  }
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      phone:
                        e.target
                          .value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",
                  }}
                />
              </div>

              {/* PAN */}
              <div>
                <label>
                  PAN NUMBER
                </label>

                <input
                  type="text"
                  value={
                    selectedCustomer.pan
                  }
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      pan:
                        e.target
                          .value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",
                  }}
                />
              </div>

              {/* Income */}
              <div>
                <label>
                  ANNUAL INCOME
                </label>

                <input
                  type="text"
                  value={
                    selectedCustomer.income
                  }
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      income:
                        e.target
                          .value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",
                  }}
                />
              </div>

              {/* Employer */}
              <div>
                <label>
                  EMPLOYER
                </label>

                <input
                  type="text"
                  value={
                    selectedCustomer.employer
                  }
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      employer:
                        e.target
                          .value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",
                  }}
                />
              </div>

              {/* Credit Score */}
              <div>
                <label>
                  CREDIT SCORE
                </label>

                <input
                  type="number"
                  value={
                    selectedCustomer.score
                  }
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      score:
                        Number(
                          e.target
                            .value
                        ),
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",
                  }}
                />
              </div>

              {/* Joined */}
              <div>
                <label>
                  JOINED DATE
                </label>

                <input
                  type="text"
                  value={
                    selectedCustomer.joined
                  }
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      joined:
                        e.target
                          .value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",
                  }}
                />
              </div>

              {/* Address */}
              <div
                style={{
                  gridColumn:
                    "1 / span 2",
                }}
              >
                <label>
                  ADDRESS
                </label>

                <textarea
                  rows={4}
                  value={
                    selectedCustomer.address
                  }
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      address:
                        e.target
                          .value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    resize:
                      "none",
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
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
                  setShowEditModal(false)
                }
                style={{
                  padding:
                    "12px 24px",

                  borderRadius:
                    "12px",

                  border:
                    "1px solid #ddd",

                  background:
                    "#fff",

                  cursor:
                    "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    const response =
                      await axios.put(
                        `http://localhost:5000/customers/${selectedCustomer!.id}`,
                        selectedCustomer
                      );

                    setCustomers(
                      customers.map(
                        (customer) =>
                          customer.id ===
                            selectedCustomer!.id
                            ? response.data
                            : customer
                      )
                    );

                    setShowEditModal(false);
                  } catch (error) {
                    console.error(error);
                  }
                }}
                style={{
                  padding:
                    "12px 26px",

                  borderRadius:
                    "12px",

                  border: "none",

                  background:
                    "#154c79",

                  color: "#fff",

                  cursor:
                    "pointer",

                  fontWeight: 600,
                }}
              >
                Save Changes
              </button>
            </div>
          </Modal>
        )
      }
    </div >
  );
}