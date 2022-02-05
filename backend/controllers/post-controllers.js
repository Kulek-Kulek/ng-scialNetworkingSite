const Post = require('../models/post');


const getPosts = async (req, res, next) => {
    let posts;
    try {
        posts = await Post.find();
    }
    catch {
        console.log('error get');
    }

    res.status(200).json({
        message: 'posts fetched',
        posts
    });
}


const getOnePost = async (req, res, next) => {
    const id = req.params.id;


    let post;
    try {
        post = await Post.findById(id);
    }
    catch {
        console.log('error get');
    }

    if (!post) {
        console.log('post doesn\t exist');
    }

    res.status(200).json({
        message: 'Post fetched', post
    });
}


const addPosts = async (req, res, next) => {
    const { title, content } = req.body.post;

    let post;

    try {
        post = await new Post({
            title,
            content
        });
    }
    catch {
        console.log('error');
    }

    post.save()
        .then(createdPost => {
            res.status(201).json({ message: 'Posts added', postId: createdPost._id });
        });
}

const updatePost = async (req, res, next) => {
    const { title, content } = req.body;
    const id = req.params.id;
    const updatingPost = new Post({
        _id: id,
        title,
        content
    });

    try {
        Post.updateOne({ _id: id }, updatingPost);
    }
    catch {
        console.log(err);
    }


    res.status(200).json({ message: 'Post updated' });
}


const deletePost = async (req, res, nest) => {
    const id = req.params.id;

    let post;
    try {
        post = await Post.deleteOne({ _id: id });
    } catch {
        console.log(err);
    }

    res.status(200).json({ message: 'Post deleted', post });
}


exports.getPosts = getPosts;
exports.getOnePost = getOnePost;
exports.addPosts = addPosts;
exports.deletePost = deletePost;
exports.updatePost = updatePost;