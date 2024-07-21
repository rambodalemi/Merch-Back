const { Router } = require("express");

const {
  deleteUser,
  getUser,
  getUsers,
  updateProfile,
} = require("../controllers/user");
const { ROLES } = require("../utils/constants");

const { authorize } = require("../middlewares/verifyRole");

const router = new Router();

router.patch("/:id", updateProfile);

router.delete("/:id", authorize(ROLES.SUPERADMIN), deleteUser);

router.get("/:id", authorize(ROLES.ADMIN), getUser);

router.get("/", authorize(ROLES.ADMIN), getUsers);

module.exports = router;
