const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect to DB first and then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB initial connection failed:", err.message);
    // Still start app to handle dynamic connections via request middleware if needed
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (DB Connection Pending)`);
    });
  });