const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;

// count connect
function countConnect() {
  return mongoose.connections.length;
}
// check overload connect

const checkOverload = () => {
  setInterval(() => {
    const numberofConnections = mongoose.connections.length;
    const numofCores = os.cpus().length;
    const memoriUsage = process.memoryUsage().rss;
    console.log("số core ", numofCores);
    console.log("memoriUsage", memoriUsage / 1024 / 1024);
    if (numberofConnections * 5 > numofCores) {
      console.log("hệ thống bị quá tải ");
    }
  }, _SECOND);
};
module.exports = {
  countConnect,
  checkOverload,
};
