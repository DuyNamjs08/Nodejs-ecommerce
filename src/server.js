const app = require("./app");
const config = require("./configs/config");
require("dotenv").config();

const PORT = config.app.port || 3000;
const server = app.listen(PORT, () => {
  console.log(`wsv ecommerce start with port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("thoat khoi server");
  });
});
