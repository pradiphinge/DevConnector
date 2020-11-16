import express from 'express';
const router = express.Router();

//@route  GET /api/posts
//@desc   GET posts
//@access Public (no auth required) 
router.get('/', (req, res) => {
    res.send('Posts Route');
})    

export default router;