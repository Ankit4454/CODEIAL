const express = require('express');

const router = express.Router();
const passport = require('passport');
const friendsController = require('../controllers/friends_controller');

router.get('/toggle/:id', passport.checkAuthentication, friendsController.toggleFriend);

module.exports = router;