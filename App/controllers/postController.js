import {HttpResponseHandler, isValidRequest} from '../Algorithms/Utils/Wrappers';
import Post from '../Algorithms/Social/Post';

const {validationResult} = require('express-validator');

exports.getAllPost = async (req, res, next) => {
    isValidRequest(req, res);
    const author = req.profile;
    HttpResponseHandler(req, res, await Post.getPosts(author));
};
exports.getPostById = async (req, res, next) => {
    isValidRequest(req, res);
    HttpResponseHandler(req, res, await Post.getPostById(req.params.id));
};
exports.createPost = async (req, res, next) => {
    isValidRequest(req, res);
    const author = req.profile;
    HttpResponseHandler(req, res, await Post.createPost(req.body, author));
};
exports.filterByTag = async (req, res, next) => {
    isValidRequest(req, res);
    HttpResponseHandler(req, res, await Post.filterPostByTag(req.body));
};
exports.editPostById = async (req, res, next) => {
    isValidRequest(req, res);
    HttpResponseHandler(req, res, await Post.editPost(req.body.id, req.body));
};
exports.deleteTempPostById = async (req, res, next) => {
    isValidRequest(req, res);
    HttpResponseHandler(req, res, await Post.deletePost(req.body.id));
};
exports.deletePostByID = async (req, res, next) => {
    isValidRequest(req, res);
    HttpResponseHandler(req, res, await Post.deletePost(req.body.id));
};

