const dotenv = require("dotenv");
const { isValidObjectId } = require("mongoose");

dotenv.config();

const albumImageValidation = async (req, res, next) => {
  try {
    const { albumId, title, description } = req.body;
    const errors = {};

    if (!albumId || albumId.trim() === "") {
      errors.albumId = "album id is required";
    } else {
      if (!isValidObjectId(albumId)) {
        errors.albumId = "album id should be valid id";
      }
    }

    if (!title || title.trim() === "") {
      errors.title = "title is required";
    }

    if (!description || description.trim() === "") {
      errors.description = "description is required";
    }

    if (!req.file) {
      errors.image = "image is required";
    }

    if (Object.keys(errors).length < 1) {
      next();
    } else {
      return res.status(400).json(errors);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = { albumImageValidation };
