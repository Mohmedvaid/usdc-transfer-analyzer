// src/server.js
const app = require("./app");
const { PORT } = require("./config/app.config");

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
