const moongoose = require('mongoose');
const Schema = moongoose.Schema;
const urlSlugs = require('mongoose-url-slugs');
const transliter = require('transliter');

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
      ref: 'User',
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

schema.statics = {
  incCommentCount(postId) {
    return this.findByIdAndUpdate(
      postId,
      { $inc: { commentCount: 1 } },
      { new: true }
    );
  },
};

schema.plugin(
  urlSlugs('title', {
    field: 'url',
    generator: (text) => transliter.slugify(text),
  })
);

schema.set('toJSON', {
  virtuals: true,
});

module.exports = moongoose.model('Post', schema);
