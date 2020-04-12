const express = require('express');
const passportGoogle = require('./google');

const router = express.Router();
router.get('/google', passportGoogle.authenticate('google', {scope: ['email', 'profile', 'openid']}));

router.get('/google/callback',
    passportGoogle.authenticate('google', {failureRedirect: '/login', session: false}),
    function (req, res) {
        res.json("DONE");
    });

module.exports = router;