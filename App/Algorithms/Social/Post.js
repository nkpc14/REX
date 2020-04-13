import Posts from '../../models/Posts';
import { Types } from 'mongoose';

class Post {
    Post = null;

    constructor(Post) {
        this.Post = Post;
    }

    getPost = async (id) => {
        const post = this.Post.find({
            _id: id
        });
        return {
            success: true,
            data: post,
            statusCode: 200
        };
    }

    createPost = async () => {
        const post = await new this.Post(userData);
        await post.save();
        if (!post) {
            return {
                message: "Problem in creating post, please try again later.",
                success: false,
                data: null,
                statusCode: 500
            };
        }
        return {
            message: "Post created successful",
            success: true,
            data: post,
            statusCode: 500
        }
    }

    editPost = async (id, postData) => {
        if (Types.ObjectId.isValid(id)) {
            const post = await this.Post.findOneAndUpdate({
                _id: id
            }, {
                $set: postData
            }, {
                new: true
            });
            if (post) {
                return {
                    success: true,
                    message: "Post Updated",
                    data: post,
                    statusCode: 200
                }
            }
        }
        return {
            success: false,
            message: "Post don't exist",
            data: null,
            statusCode: 201
        }
    }

    deletePost = async () => {
        if (Types.ObjectId.isValid(id)) {
            const post = await this.Post.findOneAndRemove({
                _id: id
            });
            return {
                success: false,
                message: "Post deleted!",
                data: null,
                statusCode: 200
            }
        }
        return {
            success: false,
            message: "Post don't exist",
            data: null,
            statusCode: 200
        }
    }

}

const post = new Post();