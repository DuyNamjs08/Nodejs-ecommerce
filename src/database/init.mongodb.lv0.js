"use strict";
const mongoose = require("mongoose");
const mogoUrl = `mongodb+srv://duynam12az:duynam08@cluster0.dvcf4av.mongodb.net/?retryWrites=true&w=majority`;
const connectDb = () => {
  if (1 === 1) {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });
  }
  return mongoose
    .connect(mogoUrl)
    .then((_) => {
      console.log("connect db success !");
    })
    .catch((err) => console.log(`error connect !`, err));
};
module.exports = connectDb;
