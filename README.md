# Avalanche Project README

This repository contains the source code for a Node.js application interfacing with the Avalanche blockchain. It includes server setup, API endpoints, and a task scheduler for updating transactions. The application is configurable for development, testing, and production environments.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MongoDB
- Access to Avalanche network

### Installing

First, clone the repository to your local machine.

```bash
git clone https://github.com/Mohmedvaid/usdc-transfer-analyzer.git
```

Next, install the dependencies.

```bash
npm install
```

### Configuration

Copy the sample environment configuration and set up your .env file.

```bash
cp .env.example .env
```

Edit the `.env` file with your environment variables. Here's an example setup:

```plaintext
ENV=DEVELOPMENT
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000
AVALANCHE_NODE_URL=https://api.avax.network/ext/bc/C/rpc
USDC_CONTRACT_ADDRESS=0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E
DB_URI=mongodb://localhost:27017/avalanche
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Running the Server

To start the server in development mode, run:

```bash
npm start || npm run start-dev
```

This will start the server on `http://localhost:3000` or on another port if you've specified one in your `.env` file.

## Running Tests

To run tests, you'll need to change the environment to `TEST` and adjust the `DB_URI` for testing purposes in your `.env` file.

```plaintext
ENV=TEST
DB_URI=mongodb://localhost:27017/avalanche_test
```

Then, execute the tests with:

```bash
npm test
```

This will run the test suite configured for your application.

## Deployment

For production deployment, ensure the `ENV` variable is set to `PRODUCTION` in your `.env` file and that all production environment variables are correctly configured, including the database URI and the Avalanche node URL.

## Built With

- [Node.js](https://nodejs.org/) - The runtime environment
- [Express](https://expressjs.com/) - The web framework used
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling tool


## Versioning

We use [SemVer](http://semver.org/) for versioning. (todo)

## Authors

- **Mohmed Vaid** - _Initial work_ - [Mohmedvaid](https://github.com/mohmedvaid)
