const { Router } = require("express");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const { s3 } = require("../utils/s3");
const AlbumImage = require("../models/albumImage.model");
const Album = require("../models/album.model");
const { albumImageValidation } = require("../validation/albumImageValidation");
const { upload } = require("../middlewares/uploadFile");

const { S3_BUCKET_NAME } = process.env;

const router = Router();

router.post(
  "/",
  upload.single("image"),
  albumImageValidation,
  async (req, res) => {
    try {
      const payload = req.body;

      if (!req.file) {
        return res
          .status(400)
          .json({ error: "An error occurred. Please try again later." });
      }
      const { key, location } = req.file;

      const newAlbumImage = new AlbumImage({
        ...payload,
        image: {
          key,
          imageURL: location,
        },
      });
      const albumImage = await newAlbumImage.save();

      return res.status(201).json(albumImage);
    } catch (error) {
      res.sendStatus(500);
      throw new Error(error);
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const albumImages = await AlbumImage.find();

    return res.status(200).json(albumImages);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const albumImage = await AlbumImage.findById(id);

    if (!albumImage) {
      return res.status(404).json({ error: "Album image not found" });
    }

    return res.status(200).json(albumImage);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/album/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const albumImages = await AlbumImage.find({ albumId: id });

    return res.status(200).json(albumImages);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const albumImage = await AlbumImage.findById(id);
    if (!albumImage) {
      return res.status(404).json({ error: "Album image not found" });
    }

    const updatedAlbumImage = await AlbumImage.findByIdAndUpdate(
      id,
      { ...payload },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    return res.status(200).json(updatedAlbumImage);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const albumImage = await AlbumImage.findById(id);
    if (!albumImage) {
      return res.status(404).json({ error: "Album image not found" });
    }

    if (albumImage.image.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: albumImage.image.key,
      });

      await s3.send(command);
    }

    await AlbumImage.findByIdAndDelete(id);

    return res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

module.exports = router;
