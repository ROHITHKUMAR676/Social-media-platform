const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createPost, getPosts } = require('../controllers/postController');

router.post('/', auth, createPost);
router.get('/', getPosts);

module.exports = router;