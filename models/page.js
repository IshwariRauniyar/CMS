const mongoose = require("mongoose");
const { Schema } = mongoose;

const PageSchema = new Schema(
  {
    Title: { type: String, required: true },
    Slug: { type: String, unique: true },
    SeoTitle: { type: String, required: true },
    SeoDescription: {
      type: String,
    },
    PostType: {
      type: Schema.Types.ObjectId,
      ref: "Setting",
    },
    Image: { type: String },
    Description: { type: String },
    Status: { type: Schema.Types.ObjectId, ref: "Setting" },
    PublishedAfter: { type: Date },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    ModifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    ModifiedOn: { type: Date, default: Date.now },
  },
  { collection: "Page" }
);

const Page = mongoose.model("Page", PageSchema);

module.exports = Page;
