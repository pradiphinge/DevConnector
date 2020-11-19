import express from 'express';
import validator from 'express-validator';
import gravatar from 'gravatar'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'

import User from '../../models/User.js';



const router = express.Router();

const { check,validationResult } = validator;

//@route  POST /api/users
//@desc   Register Users
//@access Public (no auth required) 
router.post('/', [
    check('name', 'Please provide a name').trim().not().isEmpty(),
    check('email', 'Please provide a valid email').trim().isEmail(), check('password', 'Please enter a password with 6 or more characters').trim().isLength({ min: 6 })
    ],
    async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors:errors.array()
        })
    }
    // valid inputs 
        const { name, email, password } = req.body;
        
        try {
            // lets check with database if email already with us
            let user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({
                    success: false,
                    errors: [{msg: 'User already exists'}]
                })
            }    
              //get user gravatar from github
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d:'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            user = await user.save();
            
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