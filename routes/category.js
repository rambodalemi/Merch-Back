const { Router } = require("express");
const {
  addNewCategory,
  updateCategory,
  getListOfCategories,
  getCategoryById,
  removeCategory,
} = require("../controllers/category");
const { ROLES } = require("../utils/constants");

const { verifyAccessToken } = require("../middlewares/verifyJWT");

const { authorize } = require("../middlewares/verifyRole");

const router = new Router();

router.post("/add", verifyAccessToken, authorize(ROLES.ADMIN), addNewCategory);
router.patch(
  "/update/:id",
  verifyAccessToken,
  authorize(ROLES.ADMIN),
  updateCategory
);

router.get("/list", getListOfCategories);

router.get("/:id", getCategoryById);

router.delete(
  "/remove/:id",
  verifyAccessToken,
  authorize(ROLES.ADMIN),
  removeCategory
);

module.exports = router;
