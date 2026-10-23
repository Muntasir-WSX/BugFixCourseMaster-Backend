// database connection configuration

const mongoose = require("mongoose");
const dns = require("dns");

// Ensure IPv4 first to resolve MongoDB Atlas SRV query issues on Windows
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

// Cache the connection to reuse in serverless environments
let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
  // Reuse any already-open connection, including one established by another
  // startup path before the cache was populated.
  if (mongoose.connection.readyState === 1) {
    cachedConnection = cachedConnection || mongoose.connection;
    return cachedConnection;
  }

  const configuredUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const uri = buildMongoUri(configuredUri);
  if (!uri) throw new Error("MONGODB_URI or MONGO_URI missing in .env");

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    })
    .then((connection) => {
      cachedConnection = connection;
      console.log("MongoDB Connected ✅");
      return connection;
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      throw error;
    })
    .finally(() => {
      connectionPromise = null;
    });

  return connectionPromise;
};

module.exports = connectDB;

function buildMongoUri(configuredUri) {
  if (!configuredUri) return configuredUri;

  const username = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  if (!username || !password) return configuredUri;

  const match = configuredUri.match(/^(mongodb(?:\+srv)?:\/\/)(?:[^@]+@)?(.+)$/);
  if (!match) {
    throw new Error("MONGODB_URI has an invalid MongoDB connection string format");
  }

  return `${match[1]}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${match[2]}`;
}
