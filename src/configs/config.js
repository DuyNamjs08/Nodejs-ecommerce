require("dotenv").config();
const dev = {
  app: {
    port: process.env.PORT_DEV,
  },
  db: {
    host: "localhost",
    port: 20700,
    name: "dev",
  },
};
const pro = {
  app: {
    port: process.env.PORT_PRO,
  },
  db: {
    host: "localhost",
    port: 20700,
    name: "pro",
  },
};

const config = {
  dev,
  pro,
};
const keys = process.env.NODE_ENV === "dev" ? "dev" : "pro";

module.exports = config[keys];
