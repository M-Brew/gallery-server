const { model, Schema } = require("mongoose");

const imageSchema = new Schema({
  imageURL: String,
  key: String,
});

const albumImageSchema = new Schema(
  {
    albumId: Schema.Types.ObjectId,
    title: String,
    description: String,
    image: imageSchema,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const albumImageModel = model("AlbumImage", albumImageSchema);

module.exports = albumImageModel;
