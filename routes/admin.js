const { Router } = require("express");
const {
  createAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
} = require("../controllers/admin");
const { ROLES } = require("../utils/constants");

const { verifyAccessToken } = require("../middlewares/verifyJWT");

const { authorize } = require("../middlewares/verifyRole");

const router = new Router();

router.post(
  "/add/:id",
  verifyAccessToken,
  authorize(ROLES.SUPERADMIN),
  createAdmin
);

router.delete(
  "/remove/:id",
  verifyAccessToken,
  authorize(ROLES.SUPERADMIN),
  deleteAdmin
);

router.get("/list", verifyAccessToken, authorize(ROLES.SUPERADMIN), getAdmins);

router.get("/:id", verifyAccessToken, authorize(ROLES.SUPERADMIN), getAdmin);

module.exports = router;
