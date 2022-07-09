socket = io.connect('http://localhost:5000', { transports : ['websocket'] });

let username = $('#search-input');
username.keyup(function() {
    let value = username.val();
    socket.emit('find_user', value);
});

socket.on('find_user_result', function(user) {
    if(user != null && user != [] && user.length != 0){
        $('#lookup').show();
        $('#lookup>ul').empty();
        let newUser = user.map(person => $(`
            <a class="user-list" href="/users/profile/${person._id}">
                <div class="profile">
                    <img src="${person.avatar?person.avatar:`https://avatars.dicebear.com/api/avataaars/${person.name}.svg`}" alt="${person.name}" width="50">
                </div>
                <p>${person.name}</p>
            </a>
        `));
        $('#lookup>ul').prepend(newUser);        
    } else{
        $('#lookup').hide();
    }
    
});