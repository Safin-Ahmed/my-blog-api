const { Schema, model } = require("mongoose");

const ArticleSchema = new Schema(
  {
    title: String,
    body: String,
    cover: String,
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    author: {
      type: "ObjectId",
      ref: "User",
    },
  },
  { timestamps: true, id: true }
);

const article = model("Article", ArticleSchema);
module.exports = article;
