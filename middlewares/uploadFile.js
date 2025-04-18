const multerS3 = require("multer-s3");
const multer = require("multer");
const dotenv = require("dotenv");
const crypto = require("crypto");

const { s3 } = require("../utils/s3");
const { S3_BUCKET_NAME } = process.env;

dotenv.config();

const generateImageName = (mimetype) =>
  `${crypto.randomBytes(32).toString("hex")}.${mimetype.split("/")[1]}`;

const upload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = generateImageName(file.mimetype);
      cb(null, fileName);
    },
  }),
});

module.exports = { upload };
