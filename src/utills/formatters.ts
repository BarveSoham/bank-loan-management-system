export const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtNum = (n: number) =>
  new Intl.NumberFormat("en-IN").format(Math.round(n));

export const dateStr = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const today = () =>
  new Date().toISOString().split("T")[0];