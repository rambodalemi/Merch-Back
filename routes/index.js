const { Router } = require("express");
const authRoute = require("./auth");
const userRoute = require("./user");
const categoryRoute = require("./category");
const productRoute = require("./product");
const uploadRoute = require("./upload");
const wishlistRoute = require("./wishlist");
const cartRoute = require("./cart");
const adminRoute = require("./admin");
const orderRoute = require("./order");
const paymentRoute = require("./payment");
const articleRoute = require("./article");
const couponRoute = require("./coupon");
const productOptionsRoute = require("./productOptions");
const userGameAccountRoute = require("./userGameAccount");
const codeGameRoute = require("./codeGame");
const conversationRoute = require("./conversation");
const contactRoute = require("./contact");
const oauthRoute = require("./oauth");

const { verifyAccessToken } = require("../middlewares/verifyJWT");

const { ROLES } = require("../utils/constants");

const { authorize } = require("../middlewares/verifyRole");

const router = new Router();

router.use("/auth", authRoute);
router.use("/user", verifyAccessToken, userRoute);
router.use("/category", categoryRoute);
router.use("/product", productRoute);
router.use("/upload", uploadRoute);
router.use("/wishlist", wishlistRoute);
router.use("/cart", cartRoute);
router.use("/admin", adminRoute);
router.use("/order", verifyAccessToken, orderRoute);
router.use("/payment", verifyAccessToken, paymentRoute);
router.use("/article", articleRoute);
router.use("/coupon", verifyAccessToken, authorize(ROLES.ADMIN), couponRoute);
router.use(
  "/product-option",
  verifyAccessToken,
  authorize(ROLES.ADMIN),
  productOptionsRoute
);
router.use("/game-account", verifyAccessToken, userGameAccountRoute);
router.use(
  "/code-game",
  verifyAccessToken,
  authorize(ROLES.ADMIN),
  codeGameRoute
);
router.use("/conversation", verifyAccessToken, conversationRoute);
router.use("/contact", contactRoute);
router.use("/", oauthRoute);

module.exports = router;
