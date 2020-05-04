import Posts from '../../models/Posts';
import {Types} from 'mongoose';
import {HttpSuccessResponse, HttpRejectResponse} from '../Utils/Wrappers';
import user from "./User";

class Post {
    Post = null;

    constructor(Post) {
        this.Post = Post;
    }

    getPost = async (id) => {
        const post = this.Post.find({
            _id: id
        });
        HttpSuccessResponse(post);
    };

    createPost = async () => {
        const post = await new this.Post(userData);
        await post.save();
        if (!post) {
            HttpRejectResponse("Problem in creating post, please try again later.", 500);
        }
        HttpSuccessResponse(post, "Post created successful");
    };

    editPost = async (id, postData) => {
        if (Types.ObjectId.isValid(id)) {
            const post = await this.Post.findOneAndUpdate({_id: id}, {$set: postData}, {new: true});
            if (post) {
                HttpSuccessResponse(post, "Post Updated");
            }
        }
        HttpRejectResponse("Post don't exist", 404);
    };

    deletePost = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const post = await this.Post.findOneAndRemove({_id: id});
            HttpSuccessResponse(post, "Post deleted!");
        }
        HttpRejectResponse("Post don't exist", 404);
    };
}

const post = new Post(Posts);