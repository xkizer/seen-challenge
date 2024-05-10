export enum TransactionType {
  ACH_INCOMING = "ACH_INCOMING",
  ACH_OUTGOING = "ACH_OUTGOING",
  WIRE_INCOMING = "WIRE_INCOMING",
  WIRE_OUTGOING = "WIRE_OUTGOING",
  POS = "POS",
  P2P_SEND = "P2P_SEND",
  P2P_RECEIVE = "P2P_RECEIVE",
  FEE = "FEE",
}

export enum TransactionStatus {
  SETTLED = "SETTLED",
  PENDING = "PENDING",
  RETURNED = "RETURNED",
}

export interface Transaction {
  transactionId: number;
  authorizationCode: string;
  transactionDate: string;
  customerId: number;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  description: string;
  amount: number;
  metadata: {
    relatedTransactionId?: number;
    deviceId?: string;
  };
}

export interface CustomerRelation {
  relatedCustomerId: number;
  relationType: Transaction["transactionType"] | "DEVICE";
}
