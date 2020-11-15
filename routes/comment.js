const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentCont');

router.post('/add', commentController.add);

module.exports = router;
