if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
export const NODE_ENV = process.env.NODE_ENV || "development";
