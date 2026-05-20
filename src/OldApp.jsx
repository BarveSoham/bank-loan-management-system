import { useState, useEffect } from "react";

// ─── DATA & HELPERS ────────────────────────────────────────────────────────────
const INTEREST_RATES = { personal: 12.5, home: 8.75, auto: 10.25, education: 7.5, business: 14.0 };
const LOAN_TERMS = { personal: [12,24,36,48,60], home: [60,120,180,240,300,360], auto: [12,24,36,48,60,72], education: [24,48,60,84,120], business: [12,24,36,48,60,84] };

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtNum = (n) => new Intl.NumberFormat("en-IN").format(Math.round(n));
const today = () => new Date().toISOString().split("T")[0];
const addMonths = (date, m) => { const d = new Date(date); d.setMonth(d.getMonth() + m); return d.toISOString().split("T")[0]; };
const dateStr = (d) => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

function calcEMI(principal, annualRate, months) {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

function genSchedule(principal, annualRate, months, startDate) {
  const r = annualRate / 12 / 100;
  const emi = calcEMI(principal, annualRate, months);
  let balance = principal;
  return Array.from({ length: months }, (_, i) => {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    return {
      month: i + 1,
      dueDate: addMonths(startDate, i + 1),
      emi: Math.round(emi),
      principal: Math.round(principalPaid),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
      status: "pending"
    };
  });
}

// ─── SEED DATA ─────────────────────────────────────────────────────────────────
const seedCustomers = [
  { id: "C001", name: "Priya Sharma", email: "priya.sharma@email.com", phone: "9876543210", pan: "ABCDE1234F", dob: "1988-03-15", address: "42, MG Road, Bengaluru", creditScore: 762, income: 1850000, employer: "Infosys Ltd", createdAt: "2024-01-10" },
  { id: "C002", name: "Rahul Mehta", email: "rahul.mehta@email.com", phone: "9123456780", pan: "FGHIJ5678K", dob: "1985-07-22", address: "18, Banjara Hills, Hyderabad", creditScore: 695, income: 2400000, employer: "TCS Ltd", createdAt: "2024-02-14" },
  { id: "C003", name: "Ananya Nair", email: "ananya.nair@email.com", phone: "9988776655", pan: "LMNOP9012Q", dob: "1992-11-08", address: "7, Juhu, Mumbai", creditScore: 730, income: 1200000, employer: "Wipro Ltd", createdAt: "2024-03-05" },
];

const seedLoans = [
  { id: "L001", customerId: "C001", type: "home", amount: 4500000, interestRate: 8.75, tenure: 240, status: "active", appliedAt: "2024-01-15", approvedAt: "2024-01-22", disbursedAt: "2024-02-01", purpose: "Purchase of 2BHK flat at Whitefield", collateral: "Property deed", officerNote: "Excellent credit profile, low risk" },
  { id: "L002", customerId: "C002", type: "personal", amount: 800000, interestRate: 12.5, tenure: 36, status: "active", appliedAt: "2024-02-18", approvedAt: "2024-02-25", disbursedAt: "2024-03-01", purpose: "Medical expenses", collateral: "None", officerNote: "Stable employment, approved" },
  { id: "L003", customerId: "C003", type: "education", amount: 1200000, interestRate: 7.5, tenure: 84, status: "pending", appliedAt: "2024-03-10", approvedAt: null, disbursedAt: null, purpose: "MBA studies abroad", collateral: "Parent guarantee", officerNote: "" },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    active: ["#0d5c3a", "#e6f9ef", "#1a7a50"],
    pending: ["#7a5c00", "#fff8e1", "#b07d00"],
    approved: ["#1a5276", "#e8f4fd", "#1a6fa8"],
    rejected: ["#7a1c1c", "#fdecea", "#c0392b"],
    closed: ["#444", "#f0f0f0", "#888"],
    paid: ["#0d5c3a", "#e6f9ef", "#1a7a50"],
    overdue: ["#7a1c1c", "#fdecea", "#c0392b"],
  };
  const [text, bg, border] = map[status] || ["#444", "#f5f5f5", "#999"];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, background: bg, color: text, border: `1px solid ${border}22` }}>
      {status}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, color = "#1a5276" }) => (
  <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, padding: "20px 24px", display: "flex", gap: 16, alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 12, color: "#888", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

const Input = ({ label, type = "text", value, onChange, options, required, placeholder, min, max, step, readOnly }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.03em", textTransform: "uppercase" }}>{label}{required && <span style={{ color: "#e74c3c" }}> *</span>}</label>
    {type === "select" ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#1a1a1a", background: "#fff", outline: "none" }}>
        <option value="">Select…</option>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14, resize: "vertical", fontFamily: "inherit", color: "#1a1a1a" }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} min={min} max={max} step={step} readOnly={readOnly} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#1a1a1a", background: readOnly ? "#f9f9f9" : "#fff" }} />
    )}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled }) => {
  const styles = {
    primary: { background: "linear-gradient(135deg,#1a5276,#2471a3)", color: "#fff", border: "none" },
    danger: { background: "linear-gradient(135deg,#922b21,#c0392b)", color: "#fff", border: "none" },
    success: { background: "linear-gradient(135deg,#1e8449,#27ae60)", color: "#fff", border: "none" },
    outline: { background: "#fff", color: "#1a5276", border: "1px solid #1a5276" },
    ghost: { background: "transparent", color: "#888", border: "1px solid #ddd" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...styles[variant], padding: size === "sm" ? "6px 14px" : "10px 22px", borderRadius: 8, fontSize: size === "sm" ? 13 : 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all .15s", letterSpacing: "0.02em", fontFamily: "inherit" }}>
      {children}
    </button>
  );
};

// ─── MODAL ─────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, width = 600 }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
      <div style={{ padding: "24px 28px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{title}</h2>
        <button onClick={onClose} style={{ border: "none", background: "#f5f5f5", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: "#888" }}>×</button>
      </div>
      <div style={{ padding: "24px 28px" }}>{children}</div>
    </div>
  </div>
);

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ customers, loans, onNav }) {
  const active = loans.filter(l => l.status === "active");
  const pending = loans.filter(l => l.status === "pending");
  const totalDisbursed = active.reduce((s, l) => s + l.amount, 0);

  const recentLoans = [...loans].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)).slice(0, 5);

  const loanTypeData = Object.keys(INTEREST_RATES).map(type => ({
    type, count: loans.filter(l => l.type === type).length
  })).filter(d => d.count > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
        <StatCard icon="👥" label="Total Customers" value={customers.length} sub={`${customers.filter(c => loans.some(l => l.customerId === c.id)).length} with active loans`} color="#1a5276" />
        <StatCard icon="📋" label="Total Loans" value={loans.length} sub={`${active.length} active · ${pending.length} pending`} color="#1e8449" />
        <StatCard icon="💰" label="Disbursed Portfolio" value={fmt(totalDisbursed)} sub="Active loans total" color="#7d6608" />
        <StatCard icon="⏳" label="Pending Approvals" value={pending.length} sub="Awaiting review" color="#784212" />
      </div>

      {/* Loan Type Breakdown + Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Recent Loan Applications</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                {["Loan ID", "Customer", "Type", "Amount", "Applied", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#888", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLoans.map(l => {
                const cust = customers.find(c => c.id === l.customerId);
                return (
                  <tr key={l.id} style={{ borderBottom: "1px solid #f8f8f8" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1a5276" }}>{l.id}</td>
                    <td style={{ padding: "10px 12px", color: "#1a1a1a" }}>{cust?.name}</td>
                    <td style={{ padding: "10px 12px", color: "#555", textTransform: "capitalize" }}>{l.type}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1a1a1a" }}>{fmt(l.amount)}</td>
                    <td style={{ padding: "10px 12px", color: "#888" }}>{dateStr(l.appliedAt)}</td>
                    <td style={{ padding: "10px 12px" }}><Badge status={l.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Loan distribution */}
          <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Loan Portfolio</h3>
            {loanTypeData.map(({ type, count }) => (
              <div key={type} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ textTransform: "capitalize", color: "#555" }}>{type}</span>
                  <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{count}</span>
                </div>
                <div style={{ height: 6, background: "#f0f0f0", borderRadius: 4 }}>
                  <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#1a5276,#2471a3)", width: `${(count / loans.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ background: "linear-gradient(135deg,#1a5276,#154360)", borderRadius: 16, padding: 24, color: "#fff" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Quick Actions</h3>
            {[
              { label: "➕ New Customer", nav: "customers", action: "add" },
              { label: "📝 Apply for Loan", nav: "loans", action: "apply" },
              { label: "✅ Review Pending", nav: "loans", action: "pending" },
            ].map(a => (
              <button key={a.label} onClick={() => onNav(a.nav, a.action)} style={{ display: "block", width: "100%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 10, padding: "10px 14px", marginBottom: 8, textAlign: "left", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em" }}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CUSTOMERS ─────────────────────────────────────────────────────────────────
function Customers({ customers, setCustomers, loans, initialAction }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(initialAction === "add");
  const [editing, setEditing] = useState(null);
  const [viewId, setViewId] = useState(null);

  const emptyForm = { name: "", email: "", phone: "", pan: "", dob: "", address: "", creditScore: "", income: "", employer: "" };
  const [form, setForm] = useState(emptyForm);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = c => { setEditing(c.id); setForm({ ...c }); setShowForm(true); };

  const save = () => {
    if (!form.name || !form.email || !form.phone) return alert("Fill required fields");
    if (editing) {
      setCustomers(cs => cs.map(c => c.id === editing ? { ...c, ...form } : c));
    } else {
      const id = "C" + String(customers.length + 1).padStart(3, "0");
      setCustomers(cs => [...cs, { ...form, id, createdAt: today() }]);
    }
    setShowForm(false);
  };

  const scoreColor = s => s >= 750 ? "#1e8449" : s >= 680 ? "#d68910" : "#c0392b";

  const viewCustomer = customers.find(c => c.id === viewId);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <input placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)} style={{ border: "1px solid #ddd", borderRadius: 10, padding: "10px 16px", fontSize: 14, width: 280, outline: "none" }} />
        <Btn onClick={openAdd}>+ Add Customer</Btn>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9f9f7" }}>
              {["Customer ID", "Name", "Phone", "PAN", "Credit Score", "Annual Income", "Joined", "Loans", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const custLoans = loans.filter(l => l.customerId === c.id);
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #f8f8f8" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1a5276" }}>{c.id}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{c.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#555" }}>{c.phone}</td>
                  <td style={{ padding: "12px 16px", color: "#555", fontFamily: "monospace" }}>{c.pan}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontWeight: 700, color: scoreColor(+c.creditScore) }}>{c.creditScore}</span>
                    <div style={{ width: 60, height: 4, background: "#f0f0f0", borderRadius: 2, marginTop: 4 }}>
                      <div style={{ width: `${((+c.creditScore - 300) / 600) * 100}%`, height: "100%", background: scoreColor(+c.creditScore), borderRadius: 2 }} />
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#555" }}>{fmt(c.income)}</td>
                  <td style={{ padding: "12px 16px", color: "#888" }}>{dateStr(c.createdAt)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: custLoans.length ? "#e8f4fd" : "#f5f5f5", color: custLoans.length ? "#1a5276" : "#888", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{custLoans.length}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn variant="outline" size="sm" onClick={() => setViewId(c.id)}>View</Btn>
                      <Btn variant="ghost" size="sm" onClick={() => openEdit(c)}>Edit</Btn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "#aaa" }}>No customers found</div>}
      </div>

      {showForm && (
        <Modal title={editing ? "Edit Customer" : "Add New Customer"} onClose={() => setShowForm(false)} width={680}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Full Name" value={form.name} onChange={set("name")} required />
            <Input label="Email" type="email" value={form.email} onChange={set("email")} required />
            <Input label="Phone" value={form.phone} onChange={set("phone")} required />
            <Input label="PAN Number" value={form.pan} onChange={set("pan")} placeholder="ABCDE1234F" />
            <Input label="Date of Birth" type="date" value={form.dob} onChange={set("dob")} />
            <Input label="Credit Score" type="number" value={form.creditScore} onChange={set("creditScore")} min={300} max={900} placeholder="300–900" />
            <Input label="Annual Income (₹)" type="number" value={form.income} onChange={set("income")} />
            <Input label="Employer" value={form.employer} onChange={set("employer")} />
            <div style={{ gridColumn: "1/-1" }}><Input label="Address" value={form.address} onChange={set("address")} /></div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn onClick={save}>{editing ? "Update Customer" : "Add Customer"}</Btn>
          </div>
        </Modal>
      )}

      {viewCustomer && (
        <Modal title="Customer Profile" onClose={() => setViewId(null)} width={640}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {[
              ["Customer ID", viewCustomer.id], ["Full Name", viewCustomer.name],
              ["Email", viewCustomer.email], ["Phone", viewCustomer.phone],
              ["PAN", viewCustomer.pan], ["DOB", viewCustomer.dob ? dateStr(viewCustomer.dob) : "—"],
              ["Employer", viewCustomer.employer], ["Annual Income", fmt(viewCustomer.income)],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#f9f9f7", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{k}</div>
                <div style={{ fontWeight: 600, color: "#1a1a1a", fontSize: 14 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#f9f9f7", borderRadius: 10, padding: "12px 16px", marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Address</div>
            <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{viewCustomer.address}</div>
          </div>
          <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Loan History</h4>
          {loans.filter(l => l.customerId === viewCustomer.id).length === 0
            ? <div style={{ color: "#aaa", fontSize: 14 }}>No loans on record</div>
            : loans.filter(l => l.customerId === viewCustomer.id).map(l => (
              <div key={l.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#1a5276" }}>{l.id}</span>
                  <span style={{ marginLeft: 10, color: "#555", fontSize: 13, textTransform: "capitalize" }}>{l.type} loan</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>{fmt(l.amount)}</span>
                  <Badge status={l.status} />
                </div>
              </div>
            ))
          }
        </Modal>
      )}
    </div>
  );
}

// ─── LOANS ─────────────────────────────────────────────────────────────────────
function Loans({ customers, loans, setLoans, initialAction }) {
  const [filter, setFilter] = useState(initialAction === "pending" ? "pending" : "all");
  const [showApply, setShowApply] = useState(initialAction === "apply");
  const [viewLoan, setViewLoan] = useState(null);
  const [scheduleModal, setScheduleModal] = useState(null);

  const emptyForm = { customerId: "", type: "", amount: "", tenure: "", purpose: "", collateral: "", officerNote: "" };
  const [form, setForm] = useState(emptyForm);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const filtered = loans.filter(l => filter === "all" || l.status === filter);

  const emi = form.customerId && form.type && form.amount && form.tenure
    ? calcEMI(+form.amount, INTEREST_RATES[form.type], +form.tenure)
    : 0;

  const applyLoan = () => {
    if (!form.customerId || !form.type || !form.amount || !form.tenure) return alert("Fill all required fields");
    const id = "L" + String(loans.length + 1).padStart(3, "0");
    const rate = INTEREST_RATES[form.type];
    setLoans(ls => [...ls, { ...form, id, amount: +form.amount, tenure: +form.tenure, interestRate: rate, status: "pending", appliedAt: today(), approvedAt: null, disbursedAt: null }]);
    setForm(emptyForm);
    setShowApply(false);
  };

  const approve = (id) => {
    setLoans(ls => ls.map(l => l.id === id ? { ...l, status: "approved", approvedAt: today() } : l));
    setViewLoan(null);
  };

  const disburse = (id) => {
    setLoans(ls => ls.map(l => l.id === id ? { ...l, status: "active", disbursedAt: today() } : l));
    setViewLoan(null);
  };

  const reject = (id) => {
    setLoans(ls => ls.map(l => l.id === id ? { ...l, status: "rejected" } : l));
    setViewLoan(null);
  };

  const close = (id) => {
    setLoans(ls => ls.map(l => l.id === id ? { ...l, status: "closed" } : l));
    setViewLoan(null);
  };

  const viewL = loans.find(l => l.id === viewLoan);
  const viewCust = viewL ? customers.find(c => c.id === viewL.customerId) : null;

  return (
    <div>
      {/* Filter tabs + Apply button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "pending", "approved", "active", "rejected", "closed"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? "#1a5276" : "#fff", color: filter === f ? "#fff" : "#888", borderColor: filter === f ? "#1a5276" : "#ddd", transition: "all .15s" }}>
              {f} {f !== "all" && <span style={{ fontSize: 11 }}>({loans.filter(l => l.status === f).length})</span>}
            </button>
          ))}
        </div>
        <Btn onClick={() => setShowApply(true)}>+ Apply Loan</Btn>
      </div>

      {/* Loan Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(l => {
          const cust = customers.find(c => c.id === l.customerId);
          const emiAmt = calcEMI(l.amount, l.interestRate, l.tenure);
          const totalPay = emiAmt * l.tenure;
          return (
            <div key={l.id} style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, padding: "20px 24px", display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: "0 24px", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              <div style={{ background: "#e8f4fd", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {{ personal: "👤", home: "🏠", auto: "🚗", education: "🎓", business: "💼" }[l.type]}
              </div>
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, color: "#1a5276", fontSize: 15 }}>{l.id}</span>
                  <span style={{ color: "#888", fontSize: 13 }}>·</span>
                  <span style={{ fontSize: 13, color: "#555", textTransform: "capitalize" }}>{l.type} loan</span>
                  <Badge status={l.status} />
                </div>
                <div style={{ fontSize: 13, color: "#888" }}>
                  {cust?.name} · Applied {dateStr(l.appliedAt)} · {l.tenure} months · {l.interestRate}% p.a.
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 20, color: "#1a1a1a" }}>{fmt(l.amount)}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>EMI {fmt(Math.round(emiAmt))}/mo</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="outline" size="sm" onClick={() => setViewLoan(l.id)}>Details</Btn>
                {l.status === "active" && <Btn variant="ghost" size="sm" onClick={() => setScheduleModal(l)}>Schedule</Btn>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ padding: 64, textAlign: "center", color: "#aaa", background: "#fff", borderRadius: 16, border: "1px solid #e8e8e2" }}>No loans found</div>}
      </div>

      {/* Apply Loan Modal */}
      {showApply && (
        <Modal title="New Loan Application" onClose={() => setShowApply(false)} width={700}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Input label="Customer" type="select" value={form.customerId} onChange={set("customerId")} required
                options={customers.map(c => ({ value: c.id, label: `${c.id} – ${c.name}` }))} />
            </div>
            <Input label="Loan Type" type="select" value={form.type} onChange={v => { set("type")(v); set("tenure")(""); }} required
              options={Object.keys(INTEREST_RATES).map(k => ({ value: k, label: `${k.charAt(0).toUpperCase() + k.slice(1)} (${INTEREST_RATES[k]}% p.a.)` }))} />
            <Input label="Loan Amount (₹)" type="number" value={form.amount} onChange={set("amount")} required placeholder="e.g. 500000" />
            <Input label="Tenure (Months)" type="select" value={form.tenure} onChange={set("tenure")} required
              options={form.type ? (LOAN_TERMS[form.type] || []).map(m => ({ value: m, label: `${m} months (${(m / 12).toFixed(1)} yrs)` })) : []} />
            <Input label="Interest Rate" value={form.type ? `${INTEREST_RATES[form.type]}% per annum` : ""} readOnly onChange={() => {}} />
            <Input label="Collateral" value={form.collateral} onChange={set("collateral")} placeholder="e.g. Property deed" />
            <div style={{ gridColumn: "1/-1" }}>
              <Input label="Loan Purpose" type="textarea" value={form.purpose} onChange={set("purpose")} placeholder="Describe the purpose of this loan…" required />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <Input label="Officer Notes" type="textarea" value={form.officerNote} onChange={set("officerNote")} placeholder="Internal notes…" />
            </div>
          </div>
          {emi > 0 && (
            <div style={{ background: "linear-gradient(135deg,#eaf4ff,#d6ecff)", borderRadius: 12, padding: "16px 20px", marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div><div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.04em" }}>Monthly EMI</div><div style={{ fontSize: 20, fontWeight: 800, color: "#1a5276" }}>{fmt(Math.round(emi))}</div></div>
              <div><div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total Interest</div><div style={{ fontSize: 20, fontWeight: 800, color: "#c0392b" }}>{fmt(Math.round(emi * +form.tenure - +form.amount))}</div></div>
              <div><div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total Payable</div><div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>{fmt(Math.round(emi * +form.tenure))}</div></div>
            </div>
          )}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => setShowApply(false)}>Cancel</Btn>
            <Btn onClick={applyLoan}>Submit Application</Btn>
          </div>
        </Modal>
      )}

      {/* Loan Detail Modal */}
      {viewL && viewCust && (
        <Modal title={`Loan ${viewL.id} – ${viewCust.name}`} onClose={() => setViewLoan(null)} width={680}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              ["Amount", fmt(viewL.amount)],
              ["Interest Rate", `${viewL.interestRate}% p.a.`],
              ["Tenure", `${viewL.tenure} months`],
              ["Monthly EMI", fmt(Math.round(calcEMI(viewL.amount, viewL.interestRate, viewL.tenure)))],
              ["Type", viewL.type.charAt(0).toUpperCase() + viewL.type.slice(1)],
              ["Status", viewL.status.toUpperCase()],
              ["Applied On", dateStr(viewL.appliedAt)],
              ["Approved On", viewL.approvedAt ? dateStr(viewL.approvedAt) : "—"],
              ["Disbursed On", viewL.disbursedAt ? dateStr(viewL.disbursedAt) : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#f9f9f7", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{k}</div>
                <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#f9f9f7", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Purpose</div>
            <div style={{ color: "#1a1a1a", fontSize: 14 }}>{viewL.purpose}</div>
          </div>
          {viewL.collateral && <div style={{ background: "#f9f9f7", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Collateral</div>
            <div style={{ color: "#1a1a1a", fontSize: 14 }}>{viewL.collateral}</div>
          </div>}
          {viewL.officerNote && <div style={{ background: "#fffdf0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, border: "1px solid #f5e17a" }}>
            <div style={{ fontSize: 11, color: "#997a00", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Officer Note</div>
            <div style={{ color: "#5a4500", fontSize: 14 }}>{viewL.officerNote}</div>
          </div>}
          {/* Customer Summary */}
          <div style={{ background: "#e8f4fd", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 24 }}>
            <div><div style={{ fontSize: 11, color: "#1a5276", fontWeight: 600 }}>CREDIT SCORE</div><div style={{ fontWeight: 800, color: "#1a5276", fontSize: 18 }}>{viewCust.creditScore}</div></div>
            <div><div style={{ fontSize: 11, color: "#1a5276", fontWeight: 600 }}>ANNUAL INCOME</div><div style={{ fontWeight: 800, color: "#1a5276", fontSize: 18 }}>{fmt(viewCust.income)}</div></div>
            <div><div style={{ fontSize: 11, color: "#1a5276", fontWeight: 600 }}>EMPLOYER</div><div style={{ fontWeight: 800, color: "#1a5276", fontSize: 18 }}>{viewCust.employer}</div></div>
          </div>
          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {viewL.status === "pending" && <>
              <Btn variant="success" onClick={() => approve(viewL.id)}>✓ Approve</Btn>
              <Btn variant="danger" onClick={() => reject(viewL.id)}>✗ Reject</Btn>
            </>}
            {viewL.status === "approved" && <Btn variant="success" onClick={() => disburse(viewL.id)}>💸 Disburse Loan</Btn>}
            {viewL.status === "active" && <>
              <Btn variant="ghost" onClick={() => { setScheduleModal(viewL); setViewLoan(null); }}>📅 View Schedule</Btn>
              <Btn variant="danger" onClick={() => close(viewL.id)}>Close Loan</Btn>
            </>}
            <Btn variant="ghost" onClick={() => setViewLoan(null)}>Close</Btn>
          </div>
        </Modal>
      )}

      {/* Repayment Schedule Modal */}
      {scheduleModal && (
        <Modal title={`Repayment Schedule – ${scheduleModal.id}`} onClose={() => setScheduleModal(null)} width={760}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[
              ["Principal", fmt(scheduleModal.amount)],
              ["Interest Rate", `${scheduleModal.interestRate}%`],
              ["Tenure", `${scheduleModal.tenure} months`],
              ["Monthly EMI", fmt(Math.round(calcEMI(scheduleModal.amount, scheduleModal.interestRate, scheduleModal.tenure)))],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#f0f7ff", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "#1a5276", fontWeight: 600 }}>{k}</div>
                <div style={{ fontWeight: 700, color: "#1a5276", fontSize: 15 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead style={{ position: "sticky", top: 0, background: "#f9f9f7" }}>
                <tr>
                  {["#", "Due Date", "EMI", "Principal", "Interest", "Balance"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: h === "#" ? "center" : "right", color: "#888", fontWeight: 600, fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid #eee" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {genSchedule(scheduleModal.amount, scheduleModal.interestRate, scheduleModal.tenure, scheduleModal.disbursedAt || today()).map(row => (
                  <tr key={row.month} style={{ borderBottom: "1px solid #f8f8f8", background: row.month % 2 === 0 ? "#fafaf9" : "#fff" }}>
                    <td style={{ padding: "8px 12px", textAlign: "center", color: "#aaa", fontWeight: 600 }}>{row.month}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#555" }}>{dateStr(row.dueDate)}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, color: "#1a1a1a" }}>{fmt(row.emi)}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#1e8449" }}>{fmt(row.principal)}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#c0392b" }}>{fmt(row.interest)}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#555" }}>{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── EMI CALCULATOR ─────────────────────────────────────────────────────────────
function Calculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(10.0);
  const [tenure, setTenure] = useState(60);

  const emi = calcEMI(principal, rate, tenure);
  const totalPay = emi * tenure;
  const totalInterest = totalPay - principal;
  const principalPct = Math.round((principal / totalPay) * 100);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Controls */}
        <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 20, padding: 28 }}>
          <h3 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>Loan Parameters</h3>
          {[
            { label: "Loan Amount", value: principal, set: setPrincipal, min: 50000, max: 50000000, step: 50000, fmt: fmt },
            { label: "Interest Rate (% p.a.)", value: rate, set: setRate, min: 5, max: 25, step: 0.25, fmt: v => `${v}%` },
            { label: "Tenure (Months)", value: tenure, set: setTenure, min: 6, max: 360, step: 6, fmt: v => `${v} months` },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#1a5276" }}>{s.fmt(s.value)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.set(+e.target.value)}
                style={{ width: "100%", accentColor: "#1a5276" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#bbb", marginTop: 4 }}>
                <span>{s.fmt(s.min)}</span><span>{s.fmt(s.max)}</span>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Quick Presets</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(INTEREST_RATES).map(([type, r]) => (
                <button key={type} onClick={() => setRate(r)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #ddd", background: rate === r ? "#1a5276" : "#fff", color: rate === r ? "#fff" : "#555", fontSize: 12, cursor: "pointer", textTransform: "capitalize", fontWeight: 600 }}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "linear-gradient(135deg,#1a5276,#154360)", borderRadius: 20, padding: 28, color: "#fff" }}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>Monthly EMI</div>
            <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-1px" }}>{fmt(Math.round(emi))}</div>
            <div style={{ fontSize: 13, opacity: 0.6, marginTop: 6 }}>for {tenure} months</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, padding: "20px 20px" }}>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>Total Interest</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#c0392b" }}>{fmt(Math.round(totalInterest))}</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, padding: "20px 20px" }}>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>Total Payable</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>{fmt(Math.round(totalPay))}</div>
            </div>
          </div>

          {/* Donut */}
          <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 20, padding: 24 }}>
            <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
              <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f0f0f0" strokeWidth="14" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1a5276" strokeWidth="14"
                  strokeDasharray={`${principalPct * 2.388} ${(100 - principalPct) * 2.388}`} strokeLinecap="round" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#c0392b" strokeWidth="14"
                  strokeDasharray={`${(100 - principalPct) * 2.388} ${principalPct * 2.388}`}
                  strokeDashoffset={-principalPct * 2.388} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>{principalPct}%</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>principal</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#1a5276" }} />
                <span style={{ fontSize: 13, color: "#555" }}>Principal ({principalPct}%)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#c0392b" }} />
                <span style={{ fontSize: 13, color: "#555" }}>Interest ({100 - principalPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS ───────────────────────────────────────────────────────────────────
function Reports({ customers, loans }) {
  const active = loans.filter(l => l.status === "active");
  const totalPortfolio = active.reduce((s, l) => s + l.amount, 0);
  const totalEMI = active.reduce((s, l) => s + calcEMI(l.amount, l.interestRate, l.tenure), 0);

  const byType = Object.keys(INTEREST_RATES).map(type => {
    const tLoans = loans.filter(l => l.type === type);
    return { type, count: tLoans.length, amount: tLoans.reduce((s, l) => s + l.amount, 0) };
  });

  const maxAmt = Math.max(...byType.map(d => d.amount), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
        <StatCard icon="📊" label="Portfolio Value" value={fmt(totalPortfolio)} sub="Active loans" color="#1a5276" />
        <StatCard icon="📅" label="Monthly EMI Flow" value={fmt(Math.round(totalEMI))} sub="Expected this month" color="#1e8449" />
        <StatCard icon="👥" label="Customers" value={customers.length} sub="Registered" color="#784212" />
        <StatCard icon="✅" label="Approved Rate" value={`${Math.round((loans.filter(l => l.status !== "pending").length / (loans.length || 1)) * 100)}%`} sub="Of all applications" color="#6c3483" />
      </div>

      {/* By type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700 }}>Loans by Type</h3>
          {byType.map(d => (
            <div key={d.type} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{d.type}</span>
                <span style={{ fontSize: 13, color: "#888" }}>{d.count} loans · {fmt(d.amount)}</span>
              </div>
              <div style={{ height: 10, background: "#f0f0f0", borderRadius: 5 }}>
                <div style={{ height: "100%", borderRadius: 5, background: "linear-gradient(90deg,#1a5276,#2471a3)", width: `${(d.amount / maxAmt) * 100}%`, transition: "width .6s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Status distribution */}
        <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700 }}>Loan Status Summary</h3>
          {["pending", "approved", "active", "rejected", "closed"].map(s => {
            const count = loans.filter(l => l.status === s).length;
            return (
              <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f8f8f8" }}>
                <Badge status={s} />
                <div style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a" }}>{count}</div>
                <div style={{ fontSize: 13, color: "#aaa" }}>{loans.length ? Math.round((count / loans.length) * 100) : 0}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer income vs credit score */}
      <div style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 16, padding: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Customer Risk Profile</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9f9f7" }}>
              {["Customer", "Credit Score", "Annual Income", "Active Loans", "Total Exposure", "Risk Level"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map(c => {
              const custLoans = loans.filter(l => l.customerId === c.id && l.status === "active");
              const exposure = custLoans.reduce((s, l) => s + l.amount, 0);
              const dti = c.income ? exposure / c.income : 0;
              const risk = dti > 5 ? "High" : dti > 2.5 ? "Medium" : "Low";
              const riskColor = { High: "#c0392b", Medium: "#d68910", Low: "#1e8449" };
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #f8f8f8" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: +c.creditScore >= 750 ? "#1e8449" : +c.creditScore >= 680 ? "#d68910" : "#c0392b" }}>{c.creditScore}</td>
                  <td style={{ padding: "10px 14px", color: "#555" }}>{fmt(c.income)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700 }}>{custLoans.length}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{fmt(exposure)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ background: riskColor[risk] + "20", color: riskColor[risk], padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{risk}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [tabAction, setTabAction] = useState(null);
  const [customers, setCustomers] = useState(seedCustomers);
  const [loans, setLoans] = useState(seedLoans);

  const nav = (t, action = null) => { setTab(t); setTabAction(action); };

  const tabs = [
    { id: "dashboard", icon: "🏦", label: "Dashboard" },
    { id: "customers", icon: "👥", label: "Customers" },
    { id: "loans", icon: "📋", label: "Loans" },
    { id: "calculator", icon: "🧮", label: "EMI Calculator" },
    { id: "reports", icon: "📊", label: "Reports" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6f8", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0d2d4f,#1a5276)", padding: "0 32px", display: "flex", alignItems: "center", gap: 32, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0" }}>
          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏦</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "0.01em" }}>LoanFlow Pro</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Bank Loan Management System</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 4, marginLeft: 24 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => nav(t.id)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .15s", background: tab === t.id ? "rgba(255,255,255,0.15)" : "transparent", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 7 }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
          <div style={{ color: "#fff" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Loan Officer</div>
            <div style={{ fontSize: 11, opacity: 0.5 }}>Admin</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>{tabs.find(t => t.id === tab)?.label}</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#aaa" }}>
            {tab === "dashboard" && "Overview of loan portfolio and recent activity"}
            {tab === "customers" && "Manage customer profiles and KYC information"}
            {tab === "loans" && "Process loan applications, approvals and disbursements"}
            {tab === "calculator" && "Calculate EMI, interest and repayment schedules"}
            {tab === "reports" && "Portfolio analytics and risk reports"}
          </p>
        </div>
        {tab === "dashboard" && <Dashboard customers={customers} loans={loans} onNav={nav} />}
        {tab === "customers" && <Customers customers={customers} setCustomers={setCustomers} loans={loans} initialAction={tabAction} />}
        {tab === "loans" && <Loans customers={customers} loans={loans} setLoans={setLoans} initialAction={tabAction} />}
        {tab === "calculator" && <Calculator />}
        {tab === "reports" && <Reports customers={customers} loans={loans} />}
      </div>
    </div>
  );
}
