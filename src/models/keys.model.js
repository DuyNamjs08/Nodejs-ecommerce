"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Key";
const COLECTIONS_NAME = "Keys";

// Declare the Schema of the Mongo model
var KeysSchema = new Schema(
  {
    user: {
      type: String,
      ref: "Shop",
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLECTIONS_NAME,
  }
);

//Export the model
const KeysModels = model(DOCUMENT_NAME, KeysSchema);
module.exports = KeysModels;
