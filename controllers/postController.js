const User = require('./../models/userModel');
const Post=require('./../models/postModel');

exports.getAllPosts = async (req, res, next) => {
  try {
    // FILTER: If the URL is /dungeons/123/posts, we only show posts for that dungeon
    // If it is just /posts, we show everything.
    let filter = {};
    if (req.params.dungeonId) filter = { dungeon: req.params.dungeonId };

    const posts = await Post.find(filter);

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.createPost = async (req, res, next) => {
  try {
    // 1. If the user didn't specify the Dungeon ID in the body, try to get it from the URL
    if (!req.body.dungeon) req.body.dungeon = req.params.dungeonId;
    
    // 2. Automatically tag the logged-in user as the author
    if (!req.body.user) req.body.user = req.user.id;

    const newPost = await Post.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        post: newPost
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'No post found with that ID' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};


exports.upvotePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // 1. Anti-Farming Check
    if (post.user.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot upvote your own post!' });
    }

    // 2. Increase Upvotes
    post.upvotes = post.upvotes + 1;
    await post.save();

    // 3. THE MILESTONE CHECK 🎯
    // Only pay if the NEW upvote count is a multiple of 10 (10, 20, 30...)
    let message = 'Upvoted!';
    
    if (post.upvotes % 10 === 0) {
      const author = await User.findById(post.user);
      
      // Pay the Bonus (5 Gems)
      author.gems = author.gems + 5;
      await author.save({ validateBeforeSave: false });
      
      message = `Upvoted! This was the ${post.upvotes}th like. Author earned a gemstone! 💎`;
    }

    res.status(200).json({
      status: 'success',
      data: {
        upvotes: post.upvotes,
        message: message
      }
    });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};