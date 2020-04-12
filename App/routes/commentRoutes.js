const express = require('express');
const router = express.Router();
const {getAllComment, getCommentById, createComment, editCommentById, deleteCommentByID} = require('../controllers/commentController');
const {body, param, check} = require('express-validator');
const multer = require('../../fileStorage');

router.get('/', getAllComment);
router.get('/:id',
    check('id').notEmpty().trim().escape()
    , getCommentById);
router.post('/create', [
    body('data').trim().escape().isString(),
    body('postId').notEmpty().trim().escape().isString(),
], multer('/images/social/posts', ['image/jpg', 'image/png', 'image/jpeg']).single('image'), createComment);

router.post('/edit/:id', multer('/images/social/posts', ['image/jpg', 'image/png', 'image/jpeg']).single('image'), [
    body('data').trim().escape().isString(),
], editCommentById);
router.post('/delete/:id', deleteCommentByID);

module.exports = router;