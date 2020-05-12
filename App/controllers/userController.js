import {validationResult} from 'express-validator';
import User from '../Algorithms/Social/User';
import {HttpResponseHandler, isValidRequest} from '../Algorithms/Utils/Wrappers';

export async function getAllUser(req, res, next) {
    isValidRequest(req);
    HttpResponseHandler(req, res, await User.getUsers());
}

export async function getUserById(req, res, next) {
    isValidRequest(req);
    HttpResponseHandler(req, res, await User.getUserById(req.params.id));
}

export async function getUserByUsername(req, res, next) {
    isValidRequest(req);
    HttpResponseHandler(req, res, await User.getUserByUsername(req.body.username));
}

export async function createUser(req, res, next) {
    isValidRequest(req);
    HttpResponseHandler(req, res, await User.createUser({emails: req.body.emails, username: req.body.username}));
}

export async function updateUserById(req, res, next) {
    isValidRequest(req);
    HttpResponseHandler(req, res, await User.updateUserById(req.body.id, req.body));
}

export async function deleteUserByID(req, res, next) {
    isValidRequest(req);
    HttpResponseHandler(req, res, await User.deactivate(req.body.username));
}


