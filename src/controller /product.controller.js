"use strict";
const { CreatedRespones } = require("../core/success.respone");
const ProductFactory = require("../services/product.service");
const ProductFactoryV2 = require("../services/product.serviceV2");

class productController {
  createProductController = async (req, res, next) => {
    return new CreatedRespones({
      message: "create product success  !",
      metaData: await ProductFactoryV2.createProductFactory(
        req.body.product_type,
        { ...req.body, product_shop: req.user.userId }
      ),
    }).send(res);
  };
  // createProductController = async (req, res, next) => {
  //   return new CreatedRespones({
  //     message: "create product success  !",
  //     metaData: await ProductFactory.createProductFactory(
  //       req.body.product_type,
  //       { ...req.body, product_shop: req.user.userId }
  //     ),
  //   }).send(res);
  // };
}

module.exports = new productController();
