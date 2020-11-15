const express = require('express');
const router = express.Router();
const postController = require('../controllers/postCont');

router.get('/add', postController.addPostPage);
router.post('/add', postController.addPost);

module.exports = router;
