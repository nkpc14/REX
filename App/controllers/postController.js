import {HttpResponseHandler} from '../Algorithms/Utils/Wrappers';
import Post from '../Algorithms/Social/Post';

const {validationResult} = require('express-validator');
exports.getAllPost = async (req, res, next) => {
    HttpResponseHandler(req, Post.getPost(req.body.id));
};
exports.getPostById = async (req, res, next) => {
    HttpResponseHandler(req, Post.getPost(req.body.id));
};
exports.createPost = async (req, res, next) => {
    HttpResponseHandler(req, Post.createPost(req.body));
};
exports.filterByTag = async (req, res, next) => {
    // HttpResponseHandler(req, Post.createPost(req.body));
};

exports.editPostById = async (req, res, next) => {
    HttpResponseHandler(req, Post.editPost(req.body.id, req.body));
};
exports.deleteTempPostById = async (req, res, next) => {
    HttpResponseHandler(req, Post.deletePost(req.body.id));
};

exports.deletePostByID = async (req, res, next) => {
    HttpResponseHandler(req, Post.deletePost(req.body.id));
};

