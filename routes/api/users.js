const express = require('express');
const router = express.Router();


/*
@route /api/users/test
@desc Test the users routes
@access Public
*/
router.get('/test', (req, res) => res.json({ msg: 'Users works' }));

module.exports = router;