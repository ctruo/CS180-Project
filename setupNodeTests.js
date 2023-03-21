require("dotenv").config();

if (process.env.NODE_ENV !== "test") {
  process.env.BACKUP_NODE_ENV = process.env.NODE_ENV;
  process.env.NODE_ENV = "test";
}

