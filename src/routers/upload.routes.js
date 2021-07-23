const {Router} = require('express')
const multer = require('multer');
const { isAuth } = require('../utils.js');

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

router.post('/upload', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

module.exports = router
