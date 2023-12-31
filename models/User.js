const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],  
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
  },
  {
    toJSON: {
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

userSchema.virtual("friendCount").get(function () {
  return this.friends ? this.friends.length : 0;
});

const User = model("User", userSchema);
module.exports = User;
