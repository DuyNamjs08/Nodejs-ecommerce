"use strict";
const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Shop";
const COLECTIONS_NAME = "Shops";

const ShopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLECTIONS_NAME,
  }
);
const shopModel = model(DOCUMENT_NAME, ShopSchema);
module.exports = shopModel;
