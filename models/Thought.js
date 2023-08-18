const { Schema, model, mongoose } = require("mongoose");

const reactionSchema = new Schema({
  reactionText: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => new Date(timestamp).toISOString(),
  },
});

const thoughtSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    username: {
      type: String,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => new Date(timestamp).toISOString(),
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
      transform: function (doc, ret) {
        // Transform the 'id' field to '_id'
        ret._id = ret.id;
        delete ret.id; // Remove the 'id' field
        delete ret.__v; // Remove the '__v' field
      },
    },
  }
);
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions ? this.reactions.length : 0;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
