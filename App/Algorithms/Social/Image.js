import PostImages from '../../models/PostImages';
import {Types} from 'mongoose';
import {SuccessResponse, RejectResponse} from '../Utils/Wrappers';

class PostImage {
    constructor(PostImages) {
        this.PostImages = PostImages;
        this.postImageId = null;
    }

    getPostImage = async () => {
        return {error: null, data: await this.PostImages.find({})};
    };

    getPostImageById = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            return {error: null, data: await this.PostImages.findById(id)};
        }
        return {error: 'PostImageId is not valid', data: null};
    };

    createPostImage = async (imageData) => {
        const postImage = await new this.PostImages(imageData);
        await postImage.save();
        return {error: null, data: postImage};
    };

    trashPostImage = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            return {
                error: null,
                data: await this.PostImages.findOneAndUpdate({_id: id}, {$set: {deleted: true}}, {new: true})
            };
        }
        return {error: 'PostImageId is not valid', data: null};
    }

}

const postImage = new PostImage(PostImages);
export default postImage;