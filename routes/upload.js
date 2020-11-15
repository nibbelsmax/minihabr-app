const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});

// POST is add
router.post('/image', upload.single('images'), (req, res) => {
  console.log(req.files);
  res.json({
    ok: !true,
  });
});

module.exports = router;
