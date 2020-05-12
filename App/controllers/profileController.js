import {validationResult} from 'express-validator';
import Profile from '../Algorithms/Social/Profile';
import {HttpResponseHandler, isValidRequest, RejectResponse, SuccessResponse} from '../Algorithms/Utils/Wrappers';

export async function getAllProfile(req, res, next) {
    isValidRequest(req);
    return HttpResponseHandler(req, res, await Profile.getProfile());
}

export async function getProfileById(req, res, next) {
    isValidRequest(req);
    return HttpResponseHandler(req, res, await Profile.getProfileById(req.params.id));
}

export async function createProfile(req, res, next) {

    return HttpResponseHandler(req, res, await Profile.createProfile({
        emails: req.body.emails,
        username: req.body.username
    }));
}

export async function updateProfileById(req, res, next) {
    const mobile = req.body.mobile;
    const gender = req.body.gender;
    if (mobile) {
        if (mobile.length < 10) {
            return HttpResponseHandler(req, res, RejectResponse("Mobile must be at least 10 digit"))
        }
    }
    if (gender) {
        let genders = ['MALE', 'FEMALE', 'OTHER'];
        if (genders.findIndex(element => element === gender) === -1) {
            return HttpResponseHandler(req, res, RejectResponse("Gender is not correct"))
        }
    }
    return HttpResponseHandler(req, res, await Profile.updateProfileById(req.params.id, req.body));
}

export async function deleteProfileByID(req, res, next) {
    isValidRequest(req);
    return HttpResponseHandler(req, res, await Profile.deactivate(req.body.id));
}