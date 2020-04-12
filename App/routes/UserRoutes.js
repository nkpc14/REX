const express = require('express');
const router = express.Router();
const {getAllUser, getUserById, createUser, updateUserById, deleteUserByID} = require('../controllers/userController');
const {body, param, check} = require('express-validator');


router.get('/', body('username').notEmpty().withMessage(''), getAllUser);

router.get('/:id',
    check('id').notEmpty().trim().escape()
    , getUserById);
router.get('/username/:username',
    check('username').notEmpty().trim().escape()
    , getUserById);
router.post('/create', [
    body('firstName').notEmpty().trim().escape().isString(),
    body('lastName').notEmpty().trim().escape().isString(),
    body('username').notEmpty().isString().trim().escape(),
    body('email').notEmpty().trim().escape().isEmail().normalizeEmail(),
    body('password').notEmpty().trim().escape().isLength({min: 8}),
    body('mobile').notEmpty().trim().escape().isNumeric().isLength({min: 10, max: 10}),
    body('gender').notEmpty().trim().isIn(['MALE', 'FEMALE', 'OTHER']).escape(),
    body('dob').isISO8601().toDate(),
], createUser);
router.post('/update/:id', [
    body('firstName').notEmpty().trim().escape().isString(),
    body('lastName').notEmpty().trim().escape().isString(),
    body('username').notEmpty().isString().trim().escape(),
    body('email').notEmpty().trim().escape().isEmail().normalizeEmail(),
    body('password').notEmpty().trim().escape().isLength({min: 8}),
    body('mobile').notEmpty().trim().escape().isNumeric().isLength({min: 10, max: 10}),
    body('gender').notEmpty().trim().isIn(['MALE', 'FEMALE', 'OTHER']).escape(),
    body('dob').isISO8601().toDate(),
], updateUserById);
router.post('/delete/:id', deleteUserByID);

module.exports = router;