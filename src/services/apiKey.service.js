"use strict";
const crypto = require("crypto");

const apiModel = require("../models/apiKey.model");

const findKeyById = async (key) => {
  // const newKey = await apiModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ["0000"],
  // });
  const objKey = await apiModel.findOne({ key, status: true }).lean();
  return objKey;
};
module.exports = { findKeyById };
