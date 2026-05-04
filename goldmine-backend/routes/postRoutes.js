const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');

// mergeParams: true is needed if we want to support nested routes later
// (like /dungeons/:dungeonId/posts)
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(postController.getAllPosts)
  .post(authController.protect, postController.createPost); // Must be logged in to post!

router.route('/:id')
  .get(postController.getPost);


router.route('/:id/upvote')
  .patch(authController.protect, postController.upvotePost);

module.exports = router;