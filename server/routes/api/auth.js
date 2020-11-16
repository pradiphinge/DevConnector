import express from 'express';
const router = express.Router();

//@route  GET /api/auth
//@desc   GET auth
//@access Public (no auth required) 
router.get('/', (req, res) => {
    res.send('auth Route');
})    

export default router;