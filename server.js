const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect to DB first and then handle server startup
connectDB()
  .then(() => {
    console.log("MongoDB Database Connected Successfully ✅");

    // Start local server if not in production / Vercel serverless environment
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`🚀 Local Server running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("DB initial connection failed:", err.message);

    // Fallback startup for local development if DB initial connection fails
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (DB Connection Pending)`);
      });
    }
  });

module.exports = app;