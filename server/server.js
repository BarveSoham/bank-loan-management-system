const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/test-db", async (
  req,
  res
) => {
  try {
    const result =
      await pool.query(
        "SELECT NOW()"
      );

    res.json({
      success: true,
      time:
        result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error:
        error.message,
    });
  }
});

app.get(
  "/customers",
  async (req, res) => {
    try {
      const result =
        await pool.query(
          "SELECT * FROM customers ORDER BY id ASC"
        );

      res.json(
        result.rows
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to fetch customers",
      });
    }
  }
);

app.post(
  "/customers",
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        pan,
        income,
        employer,
        address,
        joined,
        loans,
        score,
      } = req.body;

      const result =
        await pool.query(
          `
        INSERT INTO customers
        (
          name,
          email,
          phone,
          pan,
          income,
          employer,
          address,
          joined,
          loans,
          score
        )

        VALUES
        (
          $1,$2,$3,$4,$5,
          $6,$7,$8,$9,$10
        )

        RETURNING *
      `,
          [
            name,
            email,
            phone,
            pan,
            income,
            employer,
            address,
            joined,
            loans,
            score,
          ]
        );

      res.status(201).json(
        result.rows[0]
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to add customer",
      });
    }
  }
);

app.get(
  "/loans",
  async (req, res) => {
    try {
      const result =
        await pool.query(
          "SELECT * FROM loans ORDER BY id ASC"
        );

      res.json(
        result.rows
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to fetch loans",
      });
    }
  }
);

app.post(
  "/loans",
  async (req, res) => {
    try {
      const {
        customer,
        type,
        amount,
        emi,
        applied,
        tenure,
        rate,
        status,
        purpose,
        collateral,
        officerNote,
        approvedOn,
        disbursedOn,
        creditScore,
        income,
        employer,
      } = req.body;

      const result =
        await pool.query(
          `
        INSERT INTO loans
        (
          customer,
          type,
          amount,
          emi,
          applied,
          tenure,
          rate,
          status,
          purpose,
          collateral,
          officer_note,
          approved_on,
          disbursed_on,
          credit_score,
          income,
          employer
        )

        VALUES
        (
          $1,$2,$3,$4,$5,$6,
          $7,$8,$9,$10,$11,
          $12,$13,$14,$15,$16
        )

        RETURNING *
      `,
          [
            customer,
            type,
            amount,
            emi,
            applied,
            tenure,
            rate,
            status,
            purpose,
            collateral,
            officerNote,
            approvedOn,
            disbursedOn,
            creditScore,
            income,
            employer,
          ]
        );

      res.status(201).json(
        result.rows[0]
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to create loan",
      });
    }
  }
);

app.put(
  "/loans/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        status,
        approvedOn,
        disbursedOn,
      } = req.body;

      const result =
        await pool.query(
          `
        UPDATE loans

        SET
          status = $1,
          approved_on = $2,
          disbursed_on = $3

        WHERE id = $4

        RETURNING *
      `,
          [
            status,
            approvedOn,
            disbursedOn,
            id,
          ]
        );

      res.json(
        result.rows[0]
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to update loan",
      });
    }
  }
);

app.put(
  "/customers/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        name,
        email,
        phone,
        pan,
        income,
        employer,
        address,
        joined,
        loans,
        score,
      } = req.body;

      const result =
        await pool.query(
          `
        UPDATE customers

        SET
          name = $1,
          email = $2,
          phone = $3,
          pan = $4,
          income = $5,
          employer = $6,
          address = $7,
          joined = $8,
          loans = $9,
          score = $10

        WHERE id = $11

        RETURNING *
      `,
          [
            name,
            email,
            phone,
            pan,
            income,
            employer,
            address,
            joined,
            loans,
            score,
            id,
          ]
        );

      res.json(
        result.rows[0]
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to update customer",
      });
    }
  }
);

app.delete(
  "/loans/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      await pool.query(
        "DELETE FROM loans WHERE id = $1",
        [id]
      );

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to delete loan",
      });
    }
  }
);

app.delete(
  "/customers/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      await pool.query(
        "DELETE FROM customers WHERE id = $1",
        [id]
      );

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to delete customer",
      });
    }
  }
);

app.get("/", (req, res) => {
  res.send(
    "Bank Loan Backend Running 🚀"
  );
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});