const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load input validation.
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User Model
const User = require('../../models/User');

/*
@route /api/users/test
@desc Test the users routes
@access Public
*/
router.get('/test', (req, res) => res.json({ msg: 'Users works' }));


/*
@route /api/users/register
@desc Register a User
@access Public
*/
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email = "Email already exists";
            return res.status(400).json(errors);
        } else {

            const avatar = gravatar.url(req.body.email, {
                s: '200', //size
                r: 'pg', //rating
                d: 'mm' //default
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar,
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {

                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                });
            });
        }
    });
});

/*
@route /api/users/login
@desc Register a User
@access Public
*/
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;



    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = "User not found.";
                return res.status(404).json(errors);
            }

            //Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }; //create jwt payload
                        //sign token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        });
                    } else {
                        errors.password = 'incorrect password'
                        return res.status(400).json(errors);
                    }
                })
        })
});


/*
@route /api/users/current
@desc Get Current User
@access Private
*/
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = { id: req.user.id, name: req.user.name, email: req.user.email, avatar: req.user.avatar }
    res.json(user);
});


module.exports = router;