"use strict";
const mongoose = require("mongoose");
const { countConnect, checkOverload } = require("../helper/Checkmongodb");

const mogoUrl = `mongodb+srv://duynam12az:duynam08@cluster0.dvcf4av.mongodb.net/?retryWrites=true&w=majority`;
class Database {
  constructor() {
    this.connect();
  }
  connect() {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(mogoUrl)
      .then((_) => {
        console.log("connect db success PRO !");
        console.log("countConnect", countConnect());
        // checkOverload();
      })
      .catch((err) => console.log(`error connect !`));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
