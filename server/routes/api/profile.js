import express from 'express';
import validator from 'express-validator';
import axios from 'axios';
import config from 'config';

import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
import Post from '../../models/Post.js';

import auth from '../middlewares/auth.js'

const {check,validationResult} = validator
const router = express.Router();


//@route  GET /api/v1/profiles/me
//@desc   GET profiles
//@access private 
router.get('/me', auth, async(req, res) => {
    try {
        const profile = await Profile
                                .findOne({ user: req.user.id })
                                .populate('user', ['name', 'avatar'])
        
        if (!profile) {
            return res.status(400).json({
                msg:'There is no profile for this user'
            })}
        res.json(profile);

    } catch (err) {
        console.error();
        res.status(500).send('Server Error')
    }
})    

//@route  POST /api/v1/profile
//@desc   POST profile
//@access private 

router.post('/',
    [auth, [
        check('status', 'Status is required').not().isEmpty(),
        check('skills','Skills is required').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors:errors.array()
            })
        }
        const {
            company,
            website,
            location,
            bio,
            skills,
            status,
            youtube,
            twitter,
            facebook,
            instagram,
            linkedin,
            githubusername
        } = req.body
        
        // Build Profile Object
        const profileFields = {}
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim());
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (facebook) profileFields.social.facebook = facebook;

        try {
            let profile = await Profile.findOne({user:req.user.id})
            if (profile) {
                //profile exists ... lets update 
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    {$set:profileFields},
                    { new: true })
                return res.status(200).json(profile);
            }
            //no profile found ... create profile
            profile = new Profile(profileFields); //setup model
            const created_profile = await Profile.create(profile); //save object
            return res.status(201).json(created_profile);


        } catch (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
    })

//@route  GET /api/v1/profile
//@desc   GET all profiles
//@access public 
router.get('/',  async (req, res) => {
  
    try {
        const profiles = await Profile
                            .find()
                            .populate('user', ['name', 'avatar']);
        return res.status(200).json({
            success: true,
            count: profiles.length,
            profiles
        })    
        
    } catch (err) {
        return res.status(500).send("Server Error");
        
    }
    
})


//@route  GET /api/v1/profile/user/user_id
//@desc   GET profile by id
//@access public 
router.get('/user/:user_id',  async (req, res) => {
  
    try {
        const profile = await Profile
            .findOne({ user: req.params.user_id })
            .populate('user', ['name', 'avatar']);
            if (!profile) {
                return res.status(400).json({
                    success: false,
                    errors: [{ msg: 'Profile not found' }]
                })
            }
        return res.status(200).json({
            success: true,
            profile
        })
        
    } catch (err) {
        console.error(err);
        if (err.kind==='ObjectId') {
            return res.status(400).json({
                success: false,
                errors: [{ msg: 'Profile not found' }]
            })
        }
        return res.status(500).send("Server Error");
    }    
    
    
})


//@route  DELETE /api/v1/profile
//@desc   Delete profile by id .. will delete posts, profile and user too
//@access private

router.delete('/',auth, async (req, res) => {
    try {
        //remove user posts
        await Post.deleteMany({user:req.user.id})
        // remove profile
        await Profile.findOneAndDelete({ user:req.user.id });
        // remove user
        await User.findByIdAndDelete({ _id:req.user.id });

        res.send([{msg:'User deleted'}])
        
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            res.status(400).json({
                errors:[{msg:'Profile not found'}]
            })
        }
        res.send('Server Error')
    }
})


//@route  PUT /api/v1/profile/experience
//@desc   Add experience to the user profile
//@access private
router.put('/experience',
        [auth,
            [check('title', 'title is required').not().isEmpty(),
            check('from','from date is required').not().isEmpty(),
            check('company','company is required').not().isEmpty()    
            ]       
        ], async (req, res) => {
          
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                })
            }
            const {
                title,
                company,
                location,
                from,
                to,
                current,
                description
            }    = req.body

            const newExp = {
                title,
                company,
                location,
                from,
                to,
                current,
                description
            }
           try {
               const profile = await Profile.findOne({ user: req.user.id })
               if (!profile) {
                   return res.status(400).json({
                       success: false,
                       errors:[{msg:'Profile Not Found'}]
                   })
               }
               profile.experience.unshift(newExp);
               await profile.save();
               res.json(profile);
           } catch (err) {
               console.error(err);
               res.status(500).send('Server Error');
           } 
    })

//@route  DELETE /api/v1/profile/experience/:exp_id
//@desc   Delete experience from the user profile
//@access private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        if (!profile) {
        return res.status(400).json({
            success: false,
            errors:[{msg:'Profile Not Found'}]
            })
        }
    //get removeIndex
        const removeIndex = profile.experience
        .map(item => item._id)
        .indexOf(req.params.exp_id)
    
        profile.experience.splice(removeIndex, 1)
        await profile.save()

        res.status(201).json(profile)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
    
})

//@route  PUT /api/v1/profile/education
//@desc   Add education to the user profile
//@access private
router.put('/education',
        [auth,
            [check('school', 'School is required').not().isEmpty(),
            check('from','from date is required').not().isEmpty(),
            check('degree', 'degree is required').not().isEmpty(),
            check('fieldofstudy','Field of study is required').not().isEmpty()
            ]       
        ], async (req, res) => {
          
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                })
            }
            const {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            }    = req.body

            const newEdu = {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            }
           try {
               const profile = await Profile.findOne({ user: req.user.id })
               if (!profile) {
                   return res.status(400).json({
                       success: false,
                       errors:[{msg:'Profile Not Found'}]
                   })
               }
               profile.education.unshift(newEdu);
               await profile.save();
               res.json(profile);
           } catch (err) {
               console.error(err);
               res.status(500).send('Server Error');
           } 
    })

//@route  DELETE /api/v1/profile/education/:edu_id
//@desc   Delete education from the user profile
//@access private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        if (!profile) {
        return res.status(400).json({
            success: false,
            errors:[{msg:'Profile Not Found'}]
            })
        }
    //get removeIndex
        const removeIndex = profile.education
        .map(item => item._id)
        .indexOf(req.params.edu_id)
    
        profile.education.splice(removeIndex, 1)
        await profile.save()

        res.status(201).json(profile)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
    
})

//@route  GET /api/profile/github/:username
//@desc   Get all github profiles
//@access Public (no auth required) 

router.get('/github/:username', async (req, res) => {
    try {


        const response = await axios.get(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`)
        

        if (response.status !== 200) {
            return res.status(404).json({
                 msg: 'No github repository found' 
            })
        }
        
        res.status(200).json(response.data);

    } catch (err) {
        console.error(err);
        if (err.response.status === 404) {
            return res.status(404).json({
                msg: 'No github repository found' 
           })
        }
        res.status(500).send('Server Error')
    }
})
    
export default router;