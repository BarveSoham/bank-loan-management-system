import { useEffect, useState } from "react";
import axios from "axios";

import Dashboard from "./components/dashboard/Dashboard";
import Customers from "./components/customers/Customers";
import Loans from "./components/loans/Loans";
import Reports from "./components/reports/Reports";
import Calculator from "./components/calculator/Calculator";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

type Customer = any;

type Loan = any;
export default function App() {
  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [customers, setCustomers] =
  useState<Customer[]>([]);

  const [loans, setLoans] =
  useState<Loan[]>([]);

const fetchCustomers =
  async () => {
    try {
      const response =
        await axios.get(
          "https://loanflow-backend.onrender.com/customers"
        );

      setCustomers(
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  };
useEffect(() => {
  fetchCustomers();

  fetchLoans();
}, []);

const fetchLoans =
  async () => {
    try {
      const response =
        await axios.get(
          "https://loanflow-backend.onrender.com/loans"
        );

      setLoans(
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
      }}
    >
      <Header />

      <div
        style={{
          display: "flex",
          height:
            "calc(100vh - 70px)",
        }}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div
          style={{
            flex: 1,
            padding: "30px",
            overflowY: "auto",
            height: "100%",
          }}
        >
          {activeTab ===
            "dashboard" && (
              <Dashboard
                customers={customers}
                loans={loans}
              />
            )}

          {activeTab ===
            "customers" && (
              <Customers
                customers={customers}
                setCustomers={setCustomers}
              />
            )}

          {activeTab ===
            "loans" && (
              <Loans
                loans={loans}
                setLoans={setLoans}
                customers={customers}
              />
            )}

          {activeTab ===
            "calculator" && (
              <Calculator />
            )}

          {activeTab ===
            "reports" && (
              <Reports
                customers={customers}
                loans={loans}
              />
            )}
        </div>
      </div>
    </div>
  );
}