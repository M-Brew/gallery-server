const { model, Schema } = require("mongoose");

const albumSchema = new Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const albumModel = model("Album", albumSchema);

module.exports = albumModel;
