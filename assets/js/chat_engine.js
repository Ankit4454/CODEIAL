class ChatEngine{
    constructor(chatBoxId, userId, friendId){
        this.chatBox = $(`#${chatBoxId}`);
        this.userId = userId;
        this.friendId = friendId;

        this.socket = io.connect('http://localhost:5000', { transports : ['websocket'] });

        if (this.userId){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');

            self.socket.emit('join_room', {
                user_Id: self.userId,
                chatroom: self.friendId
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined', data);
            });

        });

        $('.send-btn').each(function(){

            if(self.friendId == $(this).attr('data-user')){

                $(this).click(function(){
                    
                    $('.message-input').each(function(){

                        let msg = $(this).val();

                        if (msg != ''){
                            self.socket.emit('send_message', {
                                message: msg,
                                user_Id: self.userId,
                                chatroom: self.friendId
                            });
                        }

                        $(this).val('');
                    });

                    $('.chat-messages').each(function(){
                        $(this).animate({
                            scrollTop: $(this).get(0).scrollHeight
                        }, 100);
                    });

                });
            }
            
        });

        
        
        /*$('.send-btn').click(function(){
            let msg = $('.message-input').val();
            
            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: self.friendId
                });
            }

            $('.chat-messages').animate({
                scrollTop: $(
                    '.chat-messages').get(0).scrollHeight
            }, 100);

            $('.message-input').val('');
          
        });*/

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);
            
            let newMessage = $('<li>');

            let messageType = 'other-msg';

            if (data.user_Id == self.userId){
                messageType = 'self-msg';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.addClass(messageType);

            $('.chat-messages').each(function(){

                if(self.friendId == $(this).attr('data-user')){

                    $(this).append(newMessage);

                    $(this).animate({
                        scrollTop: $(this).get(0).scrollHeight
                    }, 100);

                }

            });

            /*$('.chat-messages').append(newMessage);

            $('.chat-messages').animate({
                scrollTop: $(
                    '.chat-messages').get(0).scrollHeight
            }, 100);*/

        });           
    }
}