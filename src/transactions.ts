import type { Transaction } from "./types";

export function getCustomerTransactionGroups(
  customerId: number,
  transactions: Transaction[]
) {
  const customerTransactions = transactions
    .filter((transaction) => transaction.customerId === customerId)
    .reduce((acc, transaction) => {
      // Group by authorization code
      if (!acc[transaction.authorizationCode]) {
        acc[transaction.authorizationCode] = [];
      }

      acc[transaction.authorizationCode].push(transaction);

      return acc;
    }, {} as Record<string, Transaction[]>);

  const transactionGroups = Object.values(customerTransactions).map((group) => {
    group.sort((a, b) => {
      // Sort by ID. This assumes that the transaction ID is incremental and
      // an earlier transaction can't have a later date
      return a.transactionId - b.transactionId;
    });

    const firstTransaction = group[0];
    const lastTransaction = group[group.length - 1];

    return {
      createdAt: firstTransaction.transactionDate,
      updatedAt: lastTransaction.transactionDate,
      transactionId: firstTransaction.transactionId,
      authorizationCode: firstTransaction.authorizationCode,
      status: lastTransaction.transactionStatus,
      description: firstTransaction.description,
      transactionType: firstTransaction.transactionType,
      metadata: firstTransaction.metadata,
      timeline: group.map((transaction) => ({
        createdAt: transaction.transactionDate,
        status: transaction.transactionStatus,
        amount: transaction.amount,
      })),
    };
  });

  return transactionGroups;
}
