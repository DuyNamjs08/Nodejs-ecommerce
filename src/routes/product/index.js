const { authenticationV2 } = require("../../auth/auth");
const productController = require("../../controller /product.controller");

const { asyncHandler } = require("../../helper/asyncHandle");

const router = require("express").Router();
router.use(authenticationV2);
router.post("", asyncHandler(productController.createProductController));

module.exports = router;
