const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);

// /api/users/:username/friends
router.route('/:username/friends').post(addFriend);

// /api/users/:username/friends/:friendUsername
router.route('/:username/friends/:friendUsername').delete(removeFriend);

module.exports = router;
