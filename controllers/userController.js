const { User, Thought } = require("../models");

module.exports = {
  //get all users
  async getUsers(req, res) {
    try {      
      const users = await User.find().populate("friends");

      // Exclude certain fields from each user object
      const usersWithoutSensitiveData = users.map(user => {
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          friendCount: user.friendCount // Use the virtual property friendCount
        };
      });

      res.json(usersWithoutSensitiveData);

    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //get a single user using their ID
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        "-__v"
      );

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json({ user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //Create user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No such user exists" });
      }

      const thoughts = await Thought.deleteMany({ username: user.username });

      if (!thoughts) {
        return res.status(404).json({
          message: "No thoughts found for this user",
        });
      }

      res.json({ message: "User successfully deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //Update a user info
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "No user found with that name" });
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend to a user
  async addFriend(req, res) {
    console.log("You are adding a friend");
    console.log(req.body);

    try {
      const { userName, friendUsername } = req.body;
      const friendUser = await User.findOne({ username: friendUsername });

    if (!friendUser) {
      return res
        .status(404)
        .json({ message: "No user found with the friendUsername" });
    }

    // Update the user's friends array with the friend's ObjectId
    const user = await User.findOneAndUpdate(
      { username: userName },
      { $addToSet: { friends: friendUser._id } }, // Use friendUser._id
      { runValidators: true, new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with that name, sorry :(" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
},
  // Remove friend from a user
  async removeFriend(req, res) {
    try {
      const { userName, friendUsername } = req.body;
      const friendUser = await User.findOne({ username: friendUsername });

    if (!friendUser) {
      return res
        .status(404)
        .json({ message: "No user found with the friendUsername" });
    }

    // Remove the friend's _id from the user's friends array
    const user = await User.findOneAndUpdate(
      { username: userName },
      { $pull: { friends: friendUser._id } }, // Use friendUser._id
      { runValidators: true, new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with that name, sorry :(" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
},
};