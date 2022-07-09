
const ChatBoxId = require('../models/chatbox');
const Message = require('../models/message');
const User = require('../models/user');

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });


        socket.on('join_room', function(data){
            console.log('joining request received', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send_message', async function(data){

            let msg = await createMsg(data.message, data.user_Id, data.chatroom);

            let temp = await saveMsg(msg, data.chatroom);

            io.in(data.chatroom).emit('receive_message', data);
        });

        socket.on('find_user', async function(value) {
            let user;
            if(value.length != 0){
                user = await User.find({name: {$regex: '^' + value, $options: 'i'}}).exec();
            }
            
            //let userTry = await User.find({$text: {$search: value}});

            if (!user) socket.emit('find_user_result', null);
            else socket.emit('find_user_result', user);        
        });

    });
} 

let createMsg = async function(text, sender, chatId){

    let msg = await Message.create({
        content: text,
        sender: sender,
        chatBoxID: chatId
    });

    return msg;

}

let saveMsg = async function(msg, chatId){

    let room;

    try{
        room = await ChatBoxId.findOne({room_id: chatId});

        if(room){
            room.messages.push(msg);
            room.save();

            return;
        }else {
            room = await ChatBoxId.create({room_id : chatId});

            room.messages.push(msg);
            room.save();

            return;

        }


    }catch(err) {
        console.log('Error', err);
        return;
    }

}