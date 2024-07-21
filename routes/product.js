const { Router } = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
} = require("../controllers/product");
const { ROLES } = require("../utils/constants");

const {
  verifyAccessToken,
  decideAuthMiddleware,
} = require("../middlewares/verifyJWT");

const { authorize } = require("../middlewares/verifyRole");

const router = new Router();

router.post("/add", verifyAccessToken, authorize(ROLES.ADMIN), createProduct);

router.patch(
  "/update/:id",
  verifyAccessToken,
  authorize(ROLES.ADMIN),
  updateProduct
);

router.delete(
  "/delete/:id",
  verifyAccessToken,
  authorize(ROLES.ADMIN),
  deleteProduct
);

router.get("/find/:id", decideAuthMiddleware, getProduct);

router.get("/", decideAuthMiddleware, getProducts);

module.exports = router;
