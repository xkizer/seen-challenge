# Seen coding challenge

This is a coding challenge for Seen. This application is written in TypeScript and uses Node.js. It retrieves transaction data from an endpoint and transforms the data into the desired format.

## Running the code

To run the code, you need to have Node.js installed on your machine. This code was tested with Node.js v20.11.1. To run the code, follow these steps:

Clone the repository:

```bash
git clone https://github.com/xkizer/seen-challenge.git
```

Install the dependencies:

```bash
npm install
```

Run the code:

```bash
npm start
```

The server will start on port 3000.

Run tests:

```bash
npm run test
```

## Endpoints

The application has two endpoints:

### GET /transactions/:customerId

Returns the transactions for the given customer ID. The customer ID must be a number. This returns the list of th e user's transactions, grouped by the authorizationCode, with the timeline of the transactions.

Sample response data:

```jsonc

  "transactions": [
    {
      "createdAt": "2022-09-01T11:46:42+00:00",
      "updatedAt": "2022-09-03T15:41:42+00:00",
      "transactionId": 1,
      "authorizationCode": "F10000",
      "status": "SETTLED",
      "description": "Deposit from Citibank",
      "transactionType": "ACH_INCOMING",
      "metadata": {

      },
      "timeline": [
        {
          "createdAt": "2022-09-01T11:46:42+00:00",
          "status": "PENDING",
          "amount": 5000
        },
        {
          "createdAt": "2022-09-03T15:41:42+00:00",
          "status": "SETTLED",
          "amount": 5000
        }
      ]
    },
    // ... more transactions
]
```

### GET /related-customers/:customerId

Returns a list of customers that have been judged to be related to the given customer ID. The customer ID must be a number. Two customers are adjudged to be related if they sent money to each other or have at least one transaction with the same deviceId.

Only unique customer ID + relationship types are returned.

Sample response data:

```json
{
  "relatedCustomers": [
    {
      "relatedCustomerId": 4,
      "relationType": "P2P_RECEIVE"
    },
    {
      "relatedCustomerId": 4,
      "relationType": "DEVICE"
    },
    {
      "relatedCustomerId": 6,
      "relationType": "DEVICE"
    },
    {
      "relatedCustomerId": 7,
      "relationType": "DEVICE"
    },
    {
      "relatedCustomerId": 5,
      "relationType": "DEVICE"
    }
  ]
}
```
