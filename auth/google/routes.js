import { Router } from 'express';
import passport from './google';
import {generateJWT} from '../config'
const router = Router();
router.get('/google', passport.authenticate('google', {scope: ['email', 'profile', 'openid']}));

router.get('/google/callback',
passport.authenticate('google', {failureRedirect: '/login', session: false}),
    function (req, res) {
        res.json({success:true,data:{token:generateJWT(req.user),}});
    });

export default router;