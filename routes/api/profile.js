const express = require('express');
const router = express.Router();


/*
@route /api/profile/test
@desc Test the Profile routes
@access Public
*/
router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

module.exports = router;