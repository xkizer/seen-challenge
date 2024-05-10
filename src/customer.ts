import type { CustomerRelation, Transaction } from "./types";

export function getRelatedCustomers(
  customerId: number,
  transactions: Transaction[]
): CustomerRelation[] {
  // Get all the devices that the customer has used. Using Set for O(1) lookup
  const customerDevices = new Set(
    transactions
      .filter(
        (transaction) =>
          transaction.customerId === customerId && transaction.metadata.deviceId
      )
      .map((transaction) => transaction.metadata.deviceId as string)
  );

  // Get all transaction IDs related to the customer
  const customerTransactionIds = new Set(
    transactions
      .filter((transaction) => transaction.customerId === customerId)
      .map((transaction) => transaction.transactionId)
  );

  // Get all related customers, which is transactions where either the device id matches one of the customer's devices
  // or the relatedTransactionId matches one of the customer's transaction IDs
  const relatedCustomers = [] as Array<CustomerRelation>;
  const dedup = new Set<string>(); // Deduplication set used to avoid adding the same customerId-relationType pair multiple times

  transactions.forEach((transaction) => {
    if (transaction.customerId === customerId) {
      return;
    }

    if (
      transaction.metadata.deviceId &&
      customerDevices.has(transaction.metadata.deviceId)
    ) {
      const deviceDedupKey = `device-${transaction.customerId}`;
      if (!dedup.has(deviceDedupKey)) {
        relatedCustomers.push({
          relatedCustomerId: transaction.customerId,
          relationType: "DEVICE",
        });
        dedup.add(deviceDedupKey);
      }
    }

    if (
      transaction.metadata.relatedTransactionId &&
      customerTransactionIds.has(transaction.metadata.relatedTransactionId)
    ) {
      const transactionDedupKey = `${transaction.transactionType}-${transaction.customerId}`;
      if (!dedup.has(transactionDedupKey)) {
        relatedCustomers.push({
          relatedCustomerId: transaction.customerId,
          relationType: transaction.transactionType,
        });
        dedup.add(transactionDedupKey);
      }
    }
  });

  return relatedCustomers;
}
