class PostComments{

    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;

        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });

    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'sunset',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
            let commentForm = document.querySelectorAll('.comment-form');
            for (let i=0; i<commentForm.length; i++){
                commentForm[i].reset();
            }
            
        });
    }

    newCommentDom(comment){

        return $(`<li id="comment-${comment._id}">

        <div class="comment-head">
            <a class="comment-user" href="/users/profile/${comment.user._id}">
                
                <div class="profile">
                    <img src="${comment.user.avatar?comment.user.avatar:`https://avatars.dicebear.com/api/avataaars/${comment.user.name}.svg`}" alt="${comment.user.name}" width="50">
                </div>
                   
                <h4>
                    ${comment.user.name}&nbsp;·&nbsp;
                </h4>
                <small>${moment(comment.createdAt).fromNow().charAt(0).toUpperCase()+moment(comment.createdAt).fromNow().slice(1)}</small>
            </a>
            
            <a class="delete-comment-button" href="/comments/destroy/${comment._id}"><ion-icon name="close"></ion-icon></a>
             
        </div>
        <div class="comment-content">
            <div class="content">
                ${comment.content}
            </div>
        
            <small class="heart">
                
                <a class="toggle-like-button" data-likes="${comment.likes.length}" href="/likes/toggle/?id=${comment._id}&type=Comment">
                    <ion-icon name="heart-outline"></ion-icon>&nbsp;${comment.likes.length}
                </a>
                      
            </small>
        </div>

        </li>`);

    }

    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'sunset',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}