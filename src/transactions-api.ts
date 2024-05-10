// eveything in this file has been intentionally kept simple, including the error handling

import type { Transaction } from "./types";

// to keep the focus on the main problem
const TRANSACTIONS_URI = "https://cdn.seen.com/challenge/transactions-v2.json";

export async function getTransactions() {
  return fetch(TRANSACTIONS_URI).then((res) => {
    if (!res.ok) {
      throw new Error("Bad response from server");
    }

    return res.json() as Promise<Transaction[]>;
  });
}
