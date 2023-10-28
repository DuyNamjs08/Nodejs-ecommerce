"use strict";
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helper/asyncHandle");
const KeyTokenService = require("../services/keyToken.service");
const { NotfoundError, AuthFailure } = require("../core/error.respone");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "refreshtoken",
};
const verifyJWT = async (token, privateKey) => {
  return await JWT.verify(token, privateKey);
};
/*
1. check userid missing 
2. get accesstoken 
3. verify token 
4. check user in database 
5. check keyStore with userId 
6. ok return next()
*/
const authenticationV2 = asyncHandler(async (req, res, next) => {
  // 1. check userid missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailure("invalid request !");
  const keyStore = await KeyTokenService.findUserById(userId);
  // console.log("keystote asdsads", keyStore);
  if (!keyStore) throw new NotfoundError("not found keystore !");
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      console.log("decodeUser13131", decodeUser);
      if (userId !== decodeUser.userId)
        throw new AuthFailure("invalid userId !");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  // 2. get accesstoken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new NotfoundError("not found refresh token  !");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    console.log("decodeUser", decodeUser);
    if (userId !== decodeUser.userId) throw new AuthFailure("invalid userId !");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});
const authentication = asyncHandler(async (req, res, next) => {
  // 1. check userid missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailure("invalid request !");
  const keyStore = await KeyTokenService.findUserById(userId);
  if (!keyStore) throw new NotfoundError("not found keystore !");
  // console.log("keyStore", keyStore);
  // 2. get accesstoken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new NotfoundError("not found refresh token  !");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    console.log("decodeUser", decodeUser);
    if (userId !== decodeUser.userId) throw new AuthFailure("invalid userId !");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      //   algorithm: "RS256",
      expiresIn: "3 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      //   algorithm: "RS256",
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log("err verify ::", error);
      } else {
        console.log("decode veify::", decode);
      }
    });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("loi auth ", error);
  }
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
};
