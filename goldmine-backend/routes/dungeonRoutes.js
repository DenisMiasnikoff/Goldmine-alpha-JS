const express = require('express');
const dungeonController = require('./../controllers/dungeonController');
const authController = require('./../controllers/authController');
const postRouter = require('./postRoutes');

const router = express.Router();

router.use('/:dungeonId/posts', postRouter);

router.route('/')
  .get(dungeonController.getAllDungeons)
  .post(authController.protect, dungeonController.createDungeon); // Locked!

router.route('/:id')
  .get(dungeonController.getDungeon);

module.exports = router;