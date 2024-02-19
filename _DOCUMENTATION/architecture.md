# Project Architecture Document

This document outlines the architecture of a Node.js application designed to interface with the Avalanche blockchain, focusing on wallet and transaction management.

## Overview

The application is structured around Express.js, leveraging middleware for request handling, MongoDB for data persistence, and scheduled tasks for updating transactions in real time.

## Application Setup

### Entry Point: src/app.js

- Initializes the application, setting up essential configurations and middleware.
- Establishes database connection unless running in TEST environment.
- Schedules transaction update tasks in PRODUCTION environment.

### Environment Configuration

- Environment variables are managed through `.env` files, facilitating the configuration of server parameters, database connections, and external APIs.

## Middleware Integration

Middleware plays a crucial role in request processing, error handling, and enhancing API responses.

### Standard Response and Error Handling

- `src/middleware/standardRes.js` and `src/middleware/standardErr.js` standardize API responses and error messages, ensuring consistency across the application.

### Rate Limiting

- `src/middleware/rateLimiter.js` limits the number of requests a user can make to the API within a certain timeframe, protecting against abuse.

### CORS and Credentials

- Configured in `src/config/corsOptions.config.js`, CORS middleware controls which domains are allowed to access the API.
- `src/middleware/credentials.js` manages Cross-Origin Resource Sharing (CORS) settings, ensuring security in client-server communication.

### Request Logging

- Morgan is used for logging request details, aiding in debugging and monitoring.

## Database Models

Mongoose models define the structure of documents within MongoDB, facilitating data manipulation and retrieval.

### Wallet and Transaction Models

- `src/models/Wallet.model.js` and `src/models/Transaction.model.js` represent the wallet and transaction entities, respectively.

## Services

Services abstract business logic from route handling, promoting code reusability and separation of concerns.

### Transaction and Wallet Services

- `src/services/transaction.service.js` manages the logic for transaction-related operations.
- Wallet operations are handled similarly, abstracting the logic from controllers.

## Task Scheduling for Transaction Updates

A scheduled task fetches and stores transactions from the Avalanche blockchain at regular intervals.

### Updating Transactions

- `src/task/storeTransactions.js` is executed periodically in PRODUCTION environment to update the local database with new transactions from the Avalanche network.

## Controllers and Routes

Controllers handle incoming requests and delegate to services for business logic processing. Routes define the API endpoints, mapping them to the appropriate controllers.

### Transaction and Wallet Controllers

- Controllers in `src/controllers` directory manage the application's business logic, interacting with the database through services.

### API Routing

- `src/routes/index.js` organizes the API endpoints, facilitating modular and maintainable code.

## Conclusion

This architecture document outlines the high-level structure of the Avalanche blockchain interfacing application, detailing its configuration, middleware, database models, services, and task scheduling. The application is designed for scalability, maintainability, and efficient blockchain interaction.
