const multer = require("multer");

const fileFilter = (request, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    callback(null, true);
  } else {
    callback(new Error("Only png, jpg, jpeg ,and webp is supported"));
  }
};

exports.upload = multer({
  limits: { fileSize: 4000000 },
  fileFilter,
});
