const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('../../config/keys');

//Load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');


/*
@route /api/profile/test
@desc Test the Profile routes
@access Public
*/
router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

/*
    @route /api/profile/
    @desc Get current users profile
    @access Private
*/

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id }).then(profile => {
        if (!profile) {
            errors.noprofile = 'No profile for this user'
            res.status(404).json(errors)
        } else {
            res.json(profile);
        }
    }).catch(err => res.status(404).json(err))
});


/*
    @route /api/profile/
    @desc add profile
    @access Private
*/

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    //Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills, split into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;



});

module.exports = router;