const express = require('express');
const postsControllers = require('../controllers/post-controllers');


const router = express.Router();

router.get('/', postsControllers.getPosts);


module.exports = router;