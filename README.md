# Bank Loan Management System

A full-stack Bank Loan Management System built using React, TypeScript, Node.js, Express, PostgreSQL, and Neon DB. This project helps manage customers, loan applications, approvals, reports, and EMI calculations through a modern banking dashboard UI.

---

# Features

## Customer Management

* Add new customers
* Edit customer details
* Delete customers
* Search customers
* View customer profiles
* Dynamic loan count tracking

## Loan Management

* Create loan applications
* View loan details
* Loan approval workflow
* Loan status updates
* Delete loans
* EMI display and tracking

## Dashboard Analytics

* Total customers
* Active loans
* Disbursed portfolio
* Credit score overview
* Recent loan activity

## Reports Section

* Portfolio statistics
* Loan summaries
* Customer analytics
* Financial insights

## EMI Calculator

* Loan EMI calculation
* Interest calculations
* Tenure analysis

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Axios

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL
* Neon Database

## Deployment

* Frontend: Vercel
* Backend: Render

---

# Project Structure

```bash
new-age-bank/
│
├── server/
│   ├── server.js
│   ├── db.js
│   └── .env
│
├── src/
├── public/
├── package.json
└── vite.config.js
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/BarveSoham/bank-loan-management-system.git
```

---

# Frontend Setup

```bash
npm install
npm run dev
```

---

# Backend Setup

```bash
cd server
npm install
node server.js
```

---

# Environment Variables

Create a `.env` file inside the `server` folder.

```env
DATABASE_URL=your_neon_database_url
```

---

# API Endpoints

## Customers

```http
GET /customers
POST /customers
PUT /customers/:id
DELETE /customers/:id
```

## Loans

```http
GET /loans
POST /loans
PUT /loans/:id
DELETE /loans/:id
```

---

# Deployment

## Frontend

Deployed using Vercel.

## Backend

Deployed using Render.

## Database

Hosted on Neon PostgreSQL.

---

# Future Improvements

* Authentication system
* Admin roles
* Email notifications
* Loan payment tracking
* Document uploads
* Charts and advanced analytics
* Mobile responsive optimization

---

# Author

## Soham Barve
## Sharanamma
## preety
## Murali Mohan M 

GitHub:
[Soham Barve GitHub Profile]( https://github.com/BarveSoham)
[Sharanamma GitHub Profile](https://github.com/Sharanamma26)
[preety GitHub Profile](  )
[Murali Mohan M  GitHub Profile](  )