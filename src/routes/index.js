const { checkApiKey, checkPermission } = require("../auth/checkAuth.js");

const router = require("express").Router();

// check api key
router.use(checkApiKey);

// check permission
router.use(checkPermission("0000"));

router.use("/v1/api", require("./access/index.js"));
router.use("/v1/api/product", require("./product/index.js"));
module.exports = router;
