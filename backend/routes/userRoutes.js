const express = require('express');
const { registerUser, authUser, searchUsers } = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect, searchUsers);
router.route('/login').post(authUser);
router.route('/search').get(protect, searchUsers);

module.exports = router;