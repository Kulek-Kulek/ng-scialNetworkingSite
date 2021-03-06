const express = require('express');
const multer = require('multer');

const postsControllers = require('../controllers/post-controllers');


const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) error = null;
        cb(error, 'backend/images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})

router.get('/', postsControllers.getPosts);

router.get('/:id', postsControllers.getOnePost);

router.post('/', multer({ storage: storage }).single('image'), postsControllers.addPosts);

router.put('/:id', multer({ storage: storage }).single('image'), postsControllers.updatePost);

router.delete('/:id', postsControllers.deletePost);


module.exports = router;