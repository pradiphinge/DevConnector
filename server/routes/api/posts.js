import express from 'express';
import validator from 'express-validator';

import auth from '../middlewares/auth.js'
import Post from '../../models/Post.js'
import User from '../../models/User.js'
import Profile from '../../models/Profile.js'

const { check, validationResult } = validator;
const router = express.Router();


//@route  POST /api/v1/posts
//@desc   add post
//@access Private 
router.post('/', [auth,
    [check('text', 'text is required for a post').trim()
        .not().isEmpty()]  
    ],
    async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors:errors.array()
            })       
        }
     try {
         const user = await User.findById(req.user.id)
             .select('-password');
         const newPost = new Post({
             user: req.user.id,
             text: req.body.text.trim(),
             avatar: user.avatar,
             name:user.name
         })
         const post = await newPost.save();
         res.status(201).json(post)

     } catch (err) {
         console.error(err);
         res.status(500).send('Server Error')
     }   
    
})    

//@route  GET /api/v1/posts
//@desc   Get posts
//@access Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.status(200).json({
            success: true,
            posts
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg:'Server Error'
        })
    }
})
//@route  GET /api/v1/posts/:id
//@desc   Get a post by id
//@access Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({
                msg:'Post not found'
            })
        }
        res.status(200).json(post);

    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg:'Post not found'
            }) 
        }
        res.status(500).send({msg:'Server Error'})
    }    
})


//@route  Delete /api/v1/posts/:id
//@desc   Delete a post by id [if user owns the post] 
//@access Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({
                msg:'Post not found'
            })
        }
        //check if user owns the post 
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                msg:'User is not authorised to delete this post'
            })
        }
        await post.remove();
        res.status(200).send({msg:'Post removed'});

    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg:'Post not found'
            }) 
        }
        res.status(500).send({msg:'Server Error'})
    }    
})

//@route  PUT /api/v1/posts/like/:id
//@desc   PUT like a post by id [if user does not own the post] 
//@access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({
                msg:'Post not found'
            }) 
        }
        //check if user is trying to like own post
        if (post.user.toString() === req.user.id) {
            return res.status(401).json({
                msg:'No need to like it yourself!'
            })
        }
        // check if post is already been liked by the user   
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({
                msg:'Post already liked'
            })
        }
        // add user to likes array
        post.likes.unshift({ user: req.user.id })
        await post.save();
        res.status(201).json(post)
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg:'Post not found'
            }) 
        }
        res.status(500).send('Server Error')
    }
})

//@route  PUT /api/v1/posts/unlike/:id
//@desc   PUT unlike the post if you have liked it previously.
//@access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({
                msg:'Post not found'
            }) 
        }
        //check if user is trying to unlike own post
        if (post.user.toString() === req.user.id) {
            return res.status(401).json({
                msg:'No need to unlike it yourself!'
            })
        }
        // check if post is already been liked by the user   
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({
                msg:'Post is yet to be liked.'
            })
        }
        // remove user from likes array
        const removeIndex = post.likes.map(like => like.user.id.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1);
        //save new post
        await post.save();
        res.status(201).json(post)
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg:'Post not found'
            }) 
        }
        res.status(500).send('Server Error')
    }
})

//@route  POST /api/v1/posts/comment/:post_id
//@desc   add comment
//@access Private 
router.post('/comment/:post_id', [auth,
    [check('text', 'text is required for a comment').trim()
        .not().isEmpty()]  
    ],
    async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors:errors.array()
            })       
        }
     try {
         const user = await User.findById(req.user.id)
             .select('-password');
         const post = await Post.findById(req.params.post_id)
         
         const newComment = {
             user: req.user.id,
             text: req.body.text.trim(),
             avatar: user.avatar,
             name:user.name
         }
         post.comments.unshift(newComment);
         await post.save();
         res.status(201).json(post)

     } catch (err) {
         console.error(err);
         res.status(500).send('Server Error')
     }   
    
})    

//@route  Delete /api/v1/posts/comment/:post_id/:comment_id
//@desc   delete comment
//@access Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({
                msg:'The post you are trying to comment on has been deleted. Please refresh the page.'
            })
        }
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        if (!comment) {
            return res.status(404).json({
                msg:'comment is already removed!'
            })
        }
        const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.comment_id)
        post.comments.splice(removeIndex, 1);
        await post.save();

        res.status(200).json({
            post
        })
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg:'Post or comment does not exist!'
            })
        }
        res.send('Server Error')
    }
})


export default router;