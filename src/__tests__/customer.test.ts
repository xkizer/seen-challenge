import { getRelatedCustomers } from "../customer";
import { Transaction, TransactionStatus, TransactionType } from "../types";
import transactionsData from "../__fixtures__/transactions.json";

describe("getRelatedCustomers", () => {
  const transactions = transactionsData as Transaction[];

  test("it should return an empty array when no related customers found", () => {
    const customerId = 99;
    const relatedCustomers = getRelatedCustomers(customerId, transactions);
    expect(relatedCustomers).toHaveLength(0);
  });

  test("it should return related customers based on device ID", () => {
    const transactions = [
      {
        transactionId: 33,
        authorizationCode: "F10016",
        transactionDate: "2022-11-10T13:05:00+00:00",
        customerId: 9,
        transactionType: TransactionType.ACH_INCOMING,
        transactionStatus: TransactionStatus.SETTLED,
        description: "Transfer from Bob",
        amount: -30,
        metadata: {
          deviceId: "device-1",
        },
      },
      {
        transactionId: 35,
        authorizationCode: "F10017",
        transactionDate: "2022-11-10T13:05:00+00:00",
        customerId: 10,
        transactionType: TransactionType.ACH_OUTGOING,
        transactionStatus: TransactionStatus.SETTLED,
        description: "Transfer to Alice",
        amount: 30,
        metadata: {
          deviceId: "device-1",
        },
      },
    ];

    const customerId = 9;
    const relatedCustomers = getRelatedCustomers(customerId, transactions);
    expect(relatedCustomers).toEqual([
      {
        relatedCustomerId: 10,
        relationType: "DEVICE",
      },
    ]);
  });

  test("it should return related customers based on related transaction ID", () => {
    const transactions = [
      {
        transactionId: 33,
        authorizationCode: "F10016",
        transactionDate: "2022-11-10T13:05:00+00:00",
        customerId: 9,
        transactionType: TransactionType.P2P_SEND,
        transactionStatus: TransactionStatus.SETTLED,
        description: "Transfer to Bob",
        amount: -30,
        metadata: {
          relatedTransactionId: 34,
        },
      },
      {
        transactionId: 34,
        authorizationCode: "F10016",
        transactionDate: "2022-11-10T13:05:00+00:00",
        customerId: 8,
        transactionType: TransactionType.P2P_RECEIVE,
        transactionStatus: TransactionStatus.SETTLED,
        description: "Transfer from Alice",
        amount: 30,
        metadata: {
          relatedTransactionId: 33,
        },
      },
    ];

    const customerId = 9;
    const relatedCustomers = getRelatedCustomers(customerId, transactions);
    expect(relatedCustomers).toEqual([
      {
        relatedCustomerId: 8,
        relationType: "P2P_RECEIVE",
      },
    ]);
  });

  test("it should return empty array when no related customers found", () => {
    const transactions = [
      {
        transactionId: 33,
        authorizationCode: "F10016",
        transactionDate: "2022-11-10T13:05:00+00:00",
        customerId: 9,
        transactionType: TransactionType.ACH_OUTGOING,
        transactionStatus: TransactionStatus.SETTLED,
        description: "Transfer to Bob",
        amount: -30,
        metadata: {},
      },
      {
        transactionId: 34,
        authorizationCode: "F10016",
        transactionDate: "2022-11-10T13:05:00+00:00",
        customerId: 8,
        transactionType: TransactionType.ACH_INCOMING,
        transactionStatus: TransactionStatus.PENDING,
        description: "Transfer from Alice",
        amount: 30,
        metadata: {},
      },
    ];

    const customerId = 9;
    const relatedCustomers = getRelatedCustomers(customerId, transactions);
    expect(relatedCustomers).toEqual([]);
  });

  test("it should return related customers based on both device ID and related transaction ID", () => {
    const customerId = 3;
    const relatedCustomers = getRelatedCustomers(customerId, transactions);
    expect(relatedCustomers).toEqual([
      {
        relatedCustomerId: 4,
        relationType: "P2P_RECEIVE",
      },
      {
        relatedCustomerId: 4,
        relationType: "DEVICE",
      },
      {
        relatedCustomerId: 6,
        relationType: "DEVICE",
      },
      {
        relatedCustomerId: 7,
        relationType: "DEVICE",
      },
      {
        relatedCustomerId: 5,
        relationType: "DEVICE",
      },
    ]);
  });
});
