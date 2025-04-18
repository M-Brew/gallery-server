const { Router } = require("express");
const { DeleteObjectsCommand } = require("@aws-sdk/client-s3");

const { s3 } = require("../utils/s3");
const Album = require("../models/album.model");
const { albumValidation } = require("../validation/albumValidation");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    const { valid, errors } = albumValidation(payload);
    if (!valid) {
      return res.status(400).json(errors);
    }

    const newAlbum = new Album({
      ...payload,
    });
    const album = await newAlbum.save();

    return res.status(201).json(album);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const albums = await Album.find();

    return res.status(200).json(albums);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    return res.status(200).json(album);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      id,
      { ...payload },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    return res.status(200).json(updatedAlbum);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const imageKeys = [];
    if (album.images?.length > 0) {
      album.images.map((item) => {
        imageKeys.push({ Key: item.key });
      });
    }

    if (imageKeys.length > 0) {
      const command = new DeleteObjectsCommand({
        Bucket: S3_BUCKET_NAME,
        Delete: {
          Objects: imageKeys,
        },
      });

      await s3.send(command);
    }

    await Album.findByIdAndDelete(id);

    return res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

module.exports = router;
