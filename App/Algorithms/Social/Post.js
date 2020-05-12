import Posts from '../../models/Posts';
import Profile from '../../models/Profiles';
import Tag from '../../Algorithms/Social/Tag';
import {Types} from 'mongoose';
import {SuccessResponse, RejectResponse, HttpResponseHandler} from '../Utils/Wrappers';

class Post {
    constructor(Post) {
        this.Post = Post;
        this.Profile = Profile;
    }

    getPosts = async (author) => {
        const post = await this.Post.find({author});
        return SuccessResponse(post);
    };
    getPostById = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const post = await this.Post.findById(id);
            if (post) {
                return SuccessResponse(post);
            }
        }
        return RejectResponse("Post don't exist.", 404);
    };
    filterPostByTag = async (tag) => {
        const post = await this.Post.find({tag: tag});
        return SuccessResponse(post);
    };


    createPost = async (postData, author) => {
        try {
            const tags = postData.tag;
            postData.tags = [];
            postData.author = author;
            const post = await new this.Post(postData);
            if (tags) {
                console.log(tags);
                tags.forEach(async (name) => {
                    const response = await Tag.createTag(name);
                    if (!response.data) {
                        return response;
                    }
                    post.tags.push(response.data._id);
                })
            }
            await post.save();
            const profile = await this.Profile.findOne({_id: author});
            if (profile) {
                profile.posts.push(post);
            } else {
                return RejectResponse("Can't create post, User profile don't exist.", 401);
            }
            await profile.save();
            if (!post) {
                return RejectResponse("Problem in creating post, please try again later.", 500);
            }
            return SuccessResponse(post, "Post created successful");
        } catch (e) {
            console.log(e)
        }
    };

    editPost = async (id, postData) => {
        if (Types.ObjectId.isValid(id)) {
            const post = await this.Post.findOneAndUpdate({_id: id}, {$set: postData}, {new: true});
            if (post) {
                return SuccessResponse(post, "Post Updated");
            }
        }
        return RejectResponse("Post don't exist", 404);
    };

    deletePost = async (id) => {
        if (Types.ObjectId.isValid(id)) {
            const post = await this.Post.findOneAndRemove({_id: id});
            return SuccessResponse(post, "Post deleted!");
        }
        return RejectResponse("Post don't exist", 404);
    };
}

const post = new Post(Posts);
export default post;