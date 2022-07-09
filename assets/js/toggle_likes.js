// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;
            let heart = $('.heart');

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                if (data.data.deleted == true){
                    likesCount -= 1;
                    $(self).html(`<ion-icon name="heart-outline"></ion-icon>&nbsp;${Math.abs(likesCount) > 999 ? Math.sign(likesCount)*((Math.abs(likesCount)/1000).toFixed(1)) + 'k' : Math.sign(likesCount)*Math.abs(likesCount)}`).css({'color':'black'});
                    
                }else{
                    likesCount += 1;
                    $(self).html(`<ion-icon name="heart-outline"></ion-icon>&nbsp;${Math.abs(likesCount) > 999 ? Math.sign(likesCount)*((Math.abs(likesCount)/1000).toFixed(1)) + 'k' : Math.sign(likesCount)*Math.abs(likesCount)}`).css({'color':'red'});
                }

                $(self).attr('data-likes', likesCount);
            
            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
