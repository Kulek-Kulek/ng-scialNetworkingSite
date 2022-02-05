const express = require('express');
const postsControllers = require('../controllers/post-controllers');


const router = express.Router();

router.get('/', postsControllers.getPosts);

router.get('/:id', postsControllers.getOnePost);

router.post('/', postsControllers.addPosts);

router.put('/:id', postsControllers.updatePost);

router.delete('/:id', postsControllers.deletePost);


module.exports = router;