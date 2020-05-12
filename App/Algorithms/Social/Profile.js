import Profiles from '../../models/Profiles';
import {Types} from 'mongoose';
import {SuccessResponse, RejectResponse} from '../Utils/Wrappers';

class Profile {
    constructor(Profile) {
        this.Profile = Profile;
        this.userId = null;
    }

    getProfile = async () => {
        const profile = await this.Profile.find({});
        return SuccessResponse(profile);
    };

    getProfileId = async (userId) => {
        const profile = await this.Profile.find({
            userId: userId
        });
        return SuccessResponse(profile._id);
    };
    getProfileUserId = async (userId) => {
        const profile = await this.Profile.findOne({
            userId: userId
        });
        return SuccessResponse(profile);
    };


    getProfileById = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const profile = await this.Profile.findById(id);
            if (!profile) {
                return RejectResponse("UserProfile don't exists.", 404);
            }
            return SuccessResponse(profile);
        }
        return RejectResponse("UserProfileId is not valid.", 404);
    };


    getProfileByUsername = async (username) => {
        if (Types.ObjectId.isValid(username)) {
            const profile = await this.Profile.find({
                username: username
            });
            if (!profile) {
                return RejectResponse("UserProfile don't exists.", 404);
            }
            delete profile.password;
            delete profile.googleId;
            delete profile.accountStatus;
            return SuccessResponse(profile);
        }
    };

    createProfile = async (userId) => {
        const oldProfile = this.Profile.find({userId});
        if (!oldProfile) {
            return RejectResponse("UserProfile already exists", 200);
        } else {
            const profile = await new this.Profile(userId);
            await profile.save();
            if (!profile) {
                return RejectResponse("Problem in creating profile, please try again later.", 500);
            }
            return SuccessResponse(profile);
        }
    };

    updateProfileById = async (id, userData) => {
        if (Types.ObjectId.isValid(id)) {
            const profile = await this.Profile.findOneAndUpdate({_id: id}, {$set: userData}, {new: true});
            if (profile) {
                return SuccessResponse(profile);
            }
        }
        return RejectResponse("UserProfile don't exist", 404);
    };

    deleteProfileByID = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const profile = await this.Profile.findOneAndRemove({
                _id: id
            });
            return SuccessResponse();
        }
        return RejectResponse("UserProfile don't exist", 404);
    };

    deactivate = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const profile = await this.Profile.findOneAndUpdate({_id: id}, {$set: {accountStatus: false}}, {new: true});
            if (profile) {
                return SuccessResponse(profile, "UserProfile deactivated");
            }
        }
        return RejectResponse("UserProfile don't exist", 404);
    }
}

const profile = new Profile(Profiles);
export default profile;