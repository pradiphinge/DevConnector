import express from 'express';
const router = express.Router();

//@route  GET /api/profiles
//@desc   GET profiles
//@access Public (no auth required) 
router.get('/', (req, res) => {
    res.send('profiles Route');
})    

export default router;