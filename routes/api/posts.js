const express = require('express');
const router = express.Router();
/*
@route /api/posts/test
@desc Test the Posts routes
@access Public
*/
router.get('/test', (req, res) => res.json({ msg: 'Posts works' }));

module.exports = router;