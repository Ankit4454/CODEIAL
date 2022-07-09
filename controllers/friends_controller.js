const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.toggleFriend = async function(req, res){

    try{

        let fromUser = await User.findById(req.user._id);
        let toUser = await User.findById(req.params.id);
        let deleted = false;

        let existingFriendship = await Friendship.findOne({
            $or: [{from_user: req.user._id, to_user: req.params.id}, {from_user: req.params.id, to_user: req.user._id}]
            
        });

        if(existingFriendship){

            fromUser.friendships.pull(existingFriendship._id);
            toUser.friendships.pull(existingFriendship._id);

            fromUser.save();
            toUser.save();
            existingFriendship.remove();
            deleted = true;

        } else {

            let friendship = await Friendship.create({
                from_user: req.user._id,
                to_user: req.params.id
            });

            fromUser.friendships.push(friendship);
            toUser.friendships.push(friendship);
            fromUser.save();
            toUser.save();

        }

        if (req.xhr){
            return res.status(200).json({
                message: 'Request successful!',
                data: {
                    deleted: deleted
                }
            });
        }

        return res.redirect('back');

    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error!'
        });
    }

}