require("dotenv").config();
// Initialize database connection
require("./config/database");
// Initialize routes
const app = require("./app");
// Set port
const PORT = process.env.PORT || 3000;
// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to schoolcoreOs server!");
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
