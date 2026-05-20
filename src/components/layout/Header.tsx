import { useState } from "react";

export default function Header() {
  const [
    showMenu,
    setShowMenu,
  ] = useState(false);

  return (
    <div
      style={{
        height: "70px",
        overflow: "visible",
        background:
          "linear-gradient(135deg,#0d2d4f,#1a5276)",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        padding: "0 30px",
        color: "white",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background:
              "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
          }}
        >
          🏦
        </div>

        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: "18px",
            }}
          >
            LoanFlow Pro
          </div>

          <div
            style={{
              fontSize: "12px",
              opacity: 0.7,
            }}
          >
            Bank Loan Management System
          </div>
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          position: "relative",

          overflow: "visible",
        }}
      >
        <div
          onClick={() =>
            setShowMenu(!showMenu)
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            👤
          </div>

          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Loan Officer
            </div>

            <div
              style={{
                fontSize: "12px",
                opacity: 0.7,
              }}
            >
              Admin
            </div>
          </div>
        </div>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "55px",
              right: 0,
              width: "180px",
              background: "#fff",
              color: "#111",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.12)",
              zIndex: 9999,
            }}
          >
            <button
              onClick={() => {
                alert(
                  "Signed Out"
                );
              }}
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                background: "#fff",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}