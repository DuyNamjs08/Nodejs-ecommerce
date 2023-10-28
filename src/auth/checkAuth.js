"use strict";

const { findKeyById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "ban chua co key!",
      });
    }
    const objKey = await findKeyById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "key ko trung hop !",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "permission denied !",
      });
    }
    const valid = req.objKey.permissions.includes(permission);
    if (!valid) {
      return res.status(403).json({
        message: "permission denied !",
      });
    }
    return next();
  };
};

module.exports = { checkApiKey, checkPermission };
