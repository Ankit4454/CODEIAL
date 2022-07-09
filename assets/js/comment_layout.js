
let msgBtn = document.querySelectorAll('.msg-btn');
let chatBox = document.querySelectorAll('.chat-box1');
let closeBtn = document.querySelectorAll('.close-chat');
let chatScroll = document.querySelectorAll('.chat-messages');
let msgInput = document.querySelectorAll('.message-input');

for (let i=0; i<closeBtn.length; i++){

    closeBtn[i].addEventListener('click', function(){
        chatBox[i].classList.toggle('toggle-chat-box');
    });

}

for (let i=0; i<msgBtn.length; i++){

    msgBtn[i].addEventListener('click', function(){
        chatBox[i].classList.toggle('toggle-chat-box');
        msgInput[i].focus();
        chatScroll[i].scrollTo(0, chatScroll[i].scrollHeight);
    });

}


