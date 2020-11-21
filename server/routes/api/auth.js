import express from 'express';
import bcrypt from 'bcryptjs';
import validator from 'express-validator';
import config from 'config';
import jwt from 'jsonwebtoken'

import auth from '../middlewares/auth.js'
import User from '../../models/User.js'

const router = express.Router();
const { check, validationResult } = validator;

//@route  GET /api/auth
//@desc   GET authenticated user data 
//@access Public (no auth required) 
router.get('/',auth,async (req, res) => {
    try {
        console.log(req.user);
        const user = await User.findById(req.user.id).select('-password');
        console.log(user);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error')
    }
})    

//@route  POST /api/auth
//@desc   Login User
//@access Public (no auth required) 
router.post('/', [
    
    check('email', 'Please provide a valid email').trim().isEmail(), check('password', 'Password is required ').exists()
    ],
    async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors:errors.array()
        })
    }
    // valid inputs 
        const {  email, password } = req.body;
        
        try {
            // lets check with database if email already with us
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(401).json({
                    success: false,
                    errors: [{msg: 'Invalid credentials'}]
                })
            }    
            
            //decrypt password
            const isMatch = await bcrypt.compare(password,user.password)
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    errors: [{msg: 'Invalid credentials'}]
                })
            }

            // return jwt
            const payload = {
                user: {
                    id:user.id
                }
            }    
            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err
                     res.json({token})
            });
            
        } catch (err) {
            res.status(500).json({
                success: false,
                errors:'Server error' 
            })
        }
      
})    

export default router;