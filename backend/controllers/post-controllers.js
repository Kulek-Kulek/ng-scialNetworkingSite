const Post = require('../models/post');


const getPosts = async (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let postQuery = Post.find();

    if (pageSize && currentPage) {
        postQuery = postQuery
            .skip(pageSize * (currentPage - 1))
            .limit((pageSize))
    }

    let posts;
    try {
        posts = await postQuery;
    }
    catch {
        console.log('error get');
    }
    let postsNumber;
    try {
        postsNumber = await Post.count();
    }
    catch {
        console.log('error count');
    }

    console.log(postsNumber);

    res.status(200).json({
        message: 'posts fetched',
        posts,
        maxPosts: postsNumber
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
    const url = req.protocol + '://' + req.get('host');
    const imagePath = url + '/images/' + req.file.filename;
    const { title, content } = req.body;

    let post;

    try {
        post = await new Post({
            title,
            content,
            imagePath
        });
    }
    catch {
        console.log('error');
    }

    post.save()
        .then(createdPost => {
            res.status(201).json({
                message: 'Posts added', post: {
                    id: createdPost._id,
                    title: createdPost.title,
                    content: createdPost.content
                }
            });
        });
}

const updatePost = async (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }

    const { title, content } = req.body;
    const id = req.params.id;
    const updatingPost = new Post({
        _id: id,
        title,
        content,
        imagePath
    });

    try {
        await Post.updateOne({ _id: id }, updatingPost);
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