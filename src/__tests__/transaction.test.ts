import { getCustomerTransactionGroups } from "../transaction";
import { Transaction } from "../types";
import transactionsData from "../__fixtures__/transactions.json";

describe("getCustomerTransactionGroups", () => {
  const transactions = transactionsData as Transaction[];

  test("it should get all of the user's transaction groups", () => {
    const customerId = 1;
    const transactionGroups = getCustomerTransactionGroups(
      customerId,
      transactions
    );
    expect(transactionGroups).toHaveLength(4);

    // Authorization codes are F10000, F10001, F10002, F10003
    const authorizationCodes = transactionGroups.map(
      (group) => group.authorizationCode
    );
    expect(authorizationCodes).toEqual([
      "F10000",
      "F10001",
      "F10002",
      "F10003",
    ]);
  });

  test("it properly groups transactions by authorization code", () => {
    const customerId = 1;
    const transactionGroups = getCustomerTransactionGroups(
      customerId,
      transactions
    );

    const firstGroup = transactionGroups[0];
    expect(firstGroup.transactionId).toEqual(1); // ID of the first transaction in this group
    expect(firstGroup.timeline).toHaveLength(2); // Two transactions in this group
    expect(firstGroup.status).toEqual("SETTLED"); // Status of the last transaction in this group
    expect(firstGroup.timeline).toEqual([
      {
        createdAt: "2022-09-01T11:46:42+00:00",
        status: "PENDING",
        amount: 5000,
      },
      {
        createdAt: "2022-09-03T15:41:42+00:00",
        status: "SETTLED",
        amount: 5000,
      },
    ]);
  });
});
