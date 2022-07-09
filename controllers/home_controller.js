const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const ChatBoxId = require('../models/chatbox');
const Message = require('../models/message');
const moment = require('moment');

module.exports.home = async function(req,res){

    try{
        
        let posts = await Post.find({})
        .sort('-createdAt') 
        .populate('user')
        .populate({
            path: 'comments',
            
            options: {sort:{"createdAt": "descending"}},

            populate: {
                path: 'likes user'
            }
        }).populate('likes'); 
        
        let users = await User.find({});

        let user;

        if (req.user){
            user = await User.findById(req.user._id)
            .populate({
                path: 'friendships',
                populate: {
                    path: 'from_user'
                }
            }).populate({
                path: 'friendships',
                populate: {
                    path: 'to_user'
                }
            });

        }

        let msg = await ChatBoxId.find({}).populate('messages');;
        
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users,
            moment: moment,
            friends: user,
            message: msg
        }); 

    }catch(err){
        console.log('Error', err);
        return;
    } 
}