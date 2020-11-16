import express from 'express';
const router = express.Router();

//@route  GET /api/users
//@desc   GET Users
//@access Public (no auth required) 
router.get('/', (req, res) => {
    res.send('Users Route');
})    

export default router;