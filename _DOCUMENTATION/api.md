# API Documentation

This document provides detailed information about the API endpoints for the Wallet and Transaction services. It includes endpoint descriptions, request parameters, and example responses to help developers integrate these services into their applications.

## Wallet API

### Get Wallets

Retrieves a list of wallets, supporting optional filters for date ranges, transaction amounts, and pagination for efficient data access.

- **URL:** `<baseURL>/api/wallet`
- **Method:** `GET`
- **URL Params:** None
- **Query Params:**

  | Parameter      | Type   | Description                                      |
  | -------------- | ------ | ------------------------------------------------ |
  | start          | string | Start date filter in YYYY-MM-DDTHH:mm:ss format. |
  | end            | string | End date filter in YYYY-MM-DDTHH:mm:ss format.   |
  | mintransferred | number | Minimum transferred amount filter.               |
  | maxtransferred | number | Maximum transferred amount filter.               |
  | minreceived    | number | Minimum received amount filter.                  |
  | maxreceived    | number | Maximum received amount filter.                  |
  | limit          | number | Number of results per page (default is 10).      |
  | page           | number | Page number for pagination (default is 1).       |

- **Example query:** `http://localhost:3000/api/wallet?page=1&start=2024-02-14T01:52:05&end=2024-02-15T01:52:34&limit=12&mintransferred=1&maxtransferred=2000&minreceived=1&maxreceived=2000`

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Wallets retrieved successfully",
    "data": {
      "wallets": [
        {
          "_id": "65cd7bd3aee3c7ebe527854e",
          "address": "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
          "totalTransferred": "50.5",
          "totalReceived": "0",
          "totalTransactionCount": 15
        }
      ],
      "pagination": {
        "currentPage": 1,
        "nextPage": 2,
        "prevPage": null,
        "totalPages": 5,
        "totalItems": 50
      }
    },
    "error": false
  }
  ```

### Get Wallet by ID

Fetches a specific wallet's details using its unique ID.

- **URL:** `<baseURL>/api/wallet/:id`
- **Method:** `GET`
- **URL Params:**

  | Parameter | Type   | Description       |
  | --------- | ------ | ----------------- |
  | id        | string | ID of the wallet. |

- **Example query:** `http://localhost:3000/api/wallet/65cd7bd3aee3c7ebe527854e`

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Wallet retrieved successfully",
    "data": {
        "_id": "65cd7bd3aee3c7ebe527854e",
        "address": "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
        "totalTransferred": "50.5",
        "totalReceived": "0",
        "totalTransactionCount": 15,
        "transactions": [
          {
            "transactionId": {
                "_id": "65cd7bd3aee3c7ebe52784f0",
                "from": "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
                "to": "0xD348C516d4Bff8Dbc5AbC6Df8EB1A07350Bba7F1",
                "value": "1.5",
                "blockNumber": "41690552",
                "transactionHash": "0x1a7df4c6...9e94fd3078dbe1e9d",
                "transactionIndex": 0,
                "blockHash": "0x40c8fcc65fd753...0f6759a9106c0052b7",
                "logIndex": "0"
            },
            "type": "sent"
          },
        ]
    },
    "error": false
  }
  ```

### Get Wallet by Address

Locates and returns information about a wallet based on its blockchain address.

- **URL:** `<baseURL>/api/wallet/address/:address`
- **Method:** `GET`
- **URL Params:**

  | Parameter | Type   | Description            |
  | --------- | ------ | ---------------------- |
  | address   | string | Address of the wallet. |

- **Example query:** `http://localhost:3000/api/wallet/address/0xBF14DB80D9275FB721383a77C00Ae180fc40ae98`

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Wallet retrieved successfully",
    "data": {
      "_id": "65cd7bd3aee3c7ebe527854e",
      "address": "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
      "totalTransferred": "50.5",
      "totalReceived": "0",
      "totalTransactionCount": 15,
      "transactions": [
        {
        "transactionId": {
            "_id": "65cd7bd3aee3c7ebe52784f0",
            "from": "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
            "to": "0xD348C516d4Bff8Dbc5AbC6Df8EB1A07350Bba7F1",
            "value": "1.5",
            "blockNumber": "41690552",
            "transactionHash": "0x1a7df4c605...07f4c9e94fd3078dbe1e9d",
            "transactionIndex": 0,
            "blockHash": "0x40c8fcc65fd7...e0f6759a9106c0052b7",
            "logIndex": "0"
        },
        "type": "sent"
        },
      ]
    },
    "error": false
  }
  ```

## Transaction API

### Get Transactions

Provides a comprehensive list of transactions, allowing for filtering by date, transaction value, and includes pagination features.

- **URL:** `<baseURL>/api/transaction`
- **Method:** `GET`
- **URL Params:** None
- **Query Params:**

  | Parameter | Type   | Description                                      |
  | --------- | ------ | ------------------------------------------------ |
  | start     | string | Start date filter in YYYY-MM-DDTHH:mm:ss format. |
  | end       | string | End date filter in YYYY-MM-DDTHH:mm:ss format.   |
  | min       | number | Minimum transaction value filter.                |
  | max       | number | Maximum transaction value filter.                |
  | limit     | number | Number of results per page (default is 10).      |
  | page      | number | Page number for pagination (default is 1).       |

- **Example query:** `http://localhost:3000/api/transaction?page=1&start=2024-02-14T01:52:05&end=2024-02-15T01:52:34&limit=12&min=1&max=2000`

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Transactions retrieved successfully",
    "data": {
      "transactions": [
        {
          "_id": "65cd7bd3aee3c7ebe52784f0",
          "from": "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
          "to": "0xD348C516d4Bff8Dbc5AbC6Df8EB1A07350Bba7F1",
          "value": "1.5",
          "blockNumber": "41690552",
          "transactionHash": "0x1a7df4c6055a90b...4c9e94fd3078dbe1e9d",
          "transactionIndex": 0,
          "blockHash": "0x40c8fcc6...106c0052b7",
          "logIndex": "0"
        },
      ],
      "pagination": {
        "currentPage": 1,
        "nextPage": 2,
        "prevPage": null,
        "totalPages": 5,
        "totalItems": 50
      }
    },
    "error": false
  }
  ```

### Get Transaction by ID

Fetches detailed information about a specific transaction through its unique ID.

- **URL:** `<baseURL>/api/transaction/:id`
- **Method:** `GET`
- **URL Params:**

  | Parameter | Type   | Description           |
  | --------- | ------ | --------------------- |
  | id        | string | ID of the transaction |

- **Success Response:**

  ```json
    {
    "success": true,
    "message": "Transaction retrieved successfully",
    "data": {
        "_id": "65cd7bd3aee3c7ebe52784f0",
        "from": "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
        "to": "0xD348C516d4Bff8Dbc5AbC6Df8EB1A07350Bba7F1",
        "value": "1.5",
        "blockNumber": "41690552",
        "transactionHash": "0x1a7df4c6055a90ba412...9e94fd3078dbe1e9d",
        "transactionIndex": 0,
        "blockHash": "0x40c8fcc65fd753b...b8e0f6759a9106c0052b7",
        "logIndex": "0"
    },
    "error": false
    }
  ```

## Conclusion

This API documentation is intended to guide developers through integrating Wallet and Transaction functionalities within their platforms, providing essential endpoints for managing wallets and transactions. By following the outlined specifications, developers can effectively communicate with the API to retrieve and manipulate financial data.
