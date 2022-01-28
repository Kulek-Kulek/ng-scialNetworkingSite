const { title } = require("process")


const getPosts = (req, res, next) => {
    const posts = [
        {
            id: 1,
            title: 'post one',
            content: 'post 1 content'
        },
        {
            id: 2,
            title: 'post two',
            content: 'post 2 content'
        },
        {
            id: 3,
            title: 'post three',
            content: 'post 3 content'
        },
    ];

    res.status(200).json({
        message: 'posts fetched',
        posts
    });
}


exports.getPosts = getPosts;