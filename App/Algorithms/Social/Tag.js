import Tags from '../../models/Tags';
import {Types} from 'mongoose';
import {SuccessResponse, RejectResponse} from '../Utils/Wrappers';

class Tag {

    constructor(Tags) {
        this.Tags = Tags;
    }

    getTag = async (name) => {
        const tag = await this.Tags.findOne({name});
        return SuccessResponse(tag);
    };

    createTag = async (name) => {
        const oldTag = this.getTag(name);
        if (oldTag.data) {
            return SuccessResponse(oldTag, "Tag already exists");
        }
        const tag = await new this.Tags({name});
        await tag.save();
        if (!tag) {
            return RejectResponse("Problem in creating tag, please try again later.", 500);
        }
        return SuccessResponse(tag, "Tag created successful");
    };

    deleteTag = async (name) => {
        const post = await this.Tags.findOneAndRemove({name});
        if (!post) {
            return RejectResponse("Tag don't exist", 404);
        }
        return SuccessResponse(post, "Tag deleted!");
    };
}

const tag = new Tag(Tags);
export default tag;