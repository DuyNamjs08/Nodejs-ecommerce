"use strict";

const { Schema, model, Types } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "apiKey";
const COLECTIONS_NAME = "apiKeys";

var apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLECTIONS_NAME,
  }
);

//Export the model
const apiModel = model(DOCUMENT_NAME, apiKeySchema);
module.exports = apiModel;
