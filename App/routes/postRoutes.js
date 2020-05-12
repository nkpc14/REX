const express = require('express');
const router = express.Router();
const {getAllPost, getPostById, createPost, filterByTag, editPostById, deletePostByID} = require('../controllers/postController');
const {body, param, check} = require('express-validator');
const multer = require('../../fileStorage');

router.get('/', getAllPost);
router.get('/:id', check('id').notEmpty().trim().escape(), getPostById);
router.post('/create', [body('data').notEmpty().trim().escape().isString(),
    body('tags').trim().escape()
], multer('/images/social/posts', ['image/jpg', 'image/png', 'image/jpeg']).single('image'), createPost);

router.post('/tag/:id', [body('data').trim().escape().isString(),], filterByTag);
router.post('/edit/:id', multer('/images/social/posts', ['image/jpg', 'image/png', 'image/jpeg']).single('image'), [
    body('data').trim().escape().isString(),
], editPostById);
router.post('/delete/:id', deletePostByID);

module.exports = router;