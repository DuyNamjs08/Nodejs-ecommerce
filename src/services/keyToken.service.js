"use strict";
const Types = require("mongoose");
const KeysModels = require("../models/keys.model");

class KeyTokenService {
  static findByRefreshToken = async (refreshToken) => {
    return KeysModels.findOne({ refreshToken });
  };
  static deleteKey = async (userId) => {
    return await KeysModels.findOneAndDelete({ user: userId });
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return KeysModels.findOne({ refreshTokensUsed: refreshToken }).lean();
  };
  static removeKeyById = async (id) => {
    console.log("id>>>>>", id);
    return await KeysModels.deleteOne({ _id: id });
  };
  static findUserById = async (userId) => {
    return KeysModels.findOne({ user: userId }).lean();
  };
  static createToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // lv:000
      // const tokens = await KeysModels.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;
      // ================================
      // lv:xxx
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await KeysModels.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenService;
