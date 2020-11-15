//Paggination
const express = require("express");
const router = express.Router();
const archiveController = require("../controllers/archiveCont");

// routers
router.get("/", archiveController.posts);
router.get("/archive/:page", archiveController.posts);
router.get("/", archiveController.posts);
router.get("/archive/:page", archiveController.posts);
router.get("/posts/:post", archiveController.getPost);
router.get("/users/:login/:page*?", archiveController.userPosts);

module.exports = router;
