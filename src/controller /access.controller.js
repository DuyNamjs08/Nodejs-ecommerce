"use strict";
const { CreatedRespones, SuccessRespone } = require("../core/success.respone");
const AccessService = require("../services/access.service");

class AcessController {
  handlerRefreshToken = async (req, res, next) => {
    // return new CreatedRespones({
    //   message: "Get Token Ok",
    //   metaData: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);
    // v2
    return new CreatedRespones({
      message: "Get Token Ok",
      metaData: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    // return res.status(201).json(await AccessService.signUp(req.body));
    return new CreatedRespones({
      message: "Register Ok",
      metaData: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
  signIn = async (req, res, next) => {
    return new SuccessRespone({
      message: "Login Ok",
      metaData: await AccessService.signIn(req.body),
    }).send(res);
  };
  logout = async (req, res, next) => {
    // console.log("res", res);
    return new SuccessRespone({
      message: "Logout success",
      metaData: await AccessService.logOut(req.keyStore),
    }).send(res);
  };
}

module.exports = new AcessController();
