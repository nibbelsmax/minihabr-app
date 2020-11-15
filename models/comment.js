const moongoose = require('mongoose');
const Schema = moongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const schema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    parent: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        autopopulate: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);
schema.plugin(autopopulate);

schema.set('toJSON', {
  virtuals: true,
});

module.exports = moongoose.model('Comment', schema);
