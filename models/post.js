const moongoose = require("mongoose");
const Schema = moongoose.Schema;
const urlSlugs = require("mongoose-url-slugs");
const transliter = require("transliter");

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(
  urlSlugs("title", {
    field: "url",
    generator: (text) => transliter.slugify(text),
  })
);

schema.set("toJSON", {
  virtuals: true,
});

module.exports = moongoose.model("Post", schema);
