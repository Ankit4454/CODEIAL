function toggleFriend(toggleFriendBtn){
    $(toggleFriendBtn).click(function(event){
        event.preventDefault();
        $.ajax({
            type : 'GET',
            url : $(toggleFriendBtn).attr('href'),
            success : function(data){
                if(data.data.deleted){
                    $(toggleFriendBtn).html('Follow')
                }else{
                    $(toggleFriendBtn).html('Unfollow')
                }
                
            },
            error : function(error){
                console.log(error.responseText);
            }

                
            });

       });
}

toggleFriend($('.friend-toggle-btn'));