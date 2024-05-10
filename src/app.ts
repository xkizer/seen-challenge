import express from "express";
import { getTransactions } from "./transactions-api";
import { getRelatedCustomers } from "./customer";
import { getCustomerTransactionGroups } from "./transaction";

const app = express();

app.get("/transactions/:customerId", async (req, res) => {
  const transactions = await getTransactions();
  const customerId = parseInt(req.params.customerId);
  const transactionGroups = getCustomerTransactionGroups(
    customerId,
    transactions
  );

  res.json({ transactions: transactionGroups });
});

// Customers may be related by device or by sending funds to each other.
app.get("/related-customers/:customerId", async (req, res) => {
  const transactions = await getTransactions();
  const customerId = parseInt(req.params.customerId);
  const relatedCustomers = getRelatedCustomers(customerId, transactions);

  res.json({ relatedCustomers: relatedCustomers });
});

export default app;
