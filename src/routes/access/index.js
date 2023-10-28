const { authentication, authenticationV2 } = require("../../auth/auth");
const accessController = require("../../controller /access.controller");
const { asyncHandler } = require("../../helper/asyncHandle");

const router = require("express").Router();

router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/signin", asyncHandler(accessController.signIn));

// authorization
router.use(authenticationV2);
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handlerRefreshToken",
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
