
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const fs = require('fs');
const path = require('path');

module.exports.create = async function(req,res){

    try{

        await Post.uploadedPostImg(req, res, async function(err){
            if (err){
                console.log('Multer Error: ', err);
            }

            let post = await Post.create({
                content: req.body.content,
                user: req.user._id
            });

            if (req.file){
                post.picture = Post.postPath + '/' + req.file.filename;
            }
            post.save();

            if (req.xhr){
                post = await post.populate('user', ['name', 'avatar']).execPopulate();
    
                return res.status(200).json({
                    data: {
                        post: post
                    },
                    message: "Post created!"
                });
            }

            req.flash('success', 'Post published!');
            return res.redirect('back');

        });
        
    }catch(err){
        req.flash('error', err);
        console.log(err);
        return res.redirect('back');
    }

}

module.exports.destroy = async function(req,res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){

            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            if (post.picture){
                fs.unlinkSync(path.join(__dirname, '..', post.picture));
            }

            post.remove();

            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}