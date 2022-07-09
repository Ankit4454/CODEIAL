

{

    $('document').ready(()=>{

        let comment = document.querySelectorAll('.comment-btn');
        let box = document.querySelectorAll('.post-comments'); 
        let close = document.querySelectorAll('.close-btn');

        function toggleComment(){
            for(let i=0; i<comment.length; i++){

                comment[i].addEventListener('click', function(){ 
                    box[i].classList.toggle('toggle-commentbox');
                });
    
                close[i].addEventListener('click', function(){
                    box[i].classList.toggle('toggle-commentbox');
                });
            }
        }
        
        toggleComment();

        let createPost = function(){
            let newPostForm = $('#new-post-form');
    
            newPostForm.submit(function(e){
                e.preventDefault();
           
                let form = new FormData((newPostForm)[0]);
            
                $.ajax({
                    type: 'post',
                    url: '/posts/create',
                    data: form,
                    contentType: false,
                    processData: false,
                    success: function(data){
                        let newPost = newPostDom(data.data.post);
                        $('#posts-container>ul').prepend(newPost);
                        deletePost($(' .delete-post-button', newPost));

                        new ToggleLike($(' .toggle-like-button', newPost));

                        new PostComments(data.data.post._id);

                        new Noty({
                            theme: 'sunset',
                            text: "Post published!",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                        }).show();

                        let cm = document.querySelector('.comment-btn');
                        let bx = document.querySelector('.post-comments');
                        let cl = document.querySelector('.close-btn');

                        cm.addEventListener('click', function(){
                            bx.classList.toggle('toggle-commentbox');
                        });

                        cl.addEventListener('click', function(){
                            bx.classList.toggle('toggle-commentbox');
                        });

                        convertPostsToAjax();

                    }, error: function(error){
                        console.log(error.responseText);
                    }
                });
                $('#new-post-form')[0].reset();
            });
        }

        let newPostDom = function(post){

            return $(`<li class="post-box" id="post-${post._id}">
            <div class="post-head">
                <a class="post-user" href="/users/profile/${post.user._id}">
                
                    <div class="profile">
                        <img src="${post.user.avatar?post.user.avatar:`https://avatars.dicebear.com/api/avataaars/${post.user.name}.svg`}" alt="${post.user.name}" width="50">
                    </div>
               
                    <h4>
                        ${ post.user.name }&nbsp;·&nbsp;
                    </h4>
                    <small>${moment(post.createdAt).fromNow().charAt(0).toUpperCase()+moment(post.createdAt).fromNow().slice(1)}</small>   
                </a>
            
                <a class="delete-post-button" href="/posts/destroy/${post._id}"><ion-icon name="close"></ion-icon></a>
           
            </div>
            <div class="post-wrap">
                <p>
                    ${post.content}
                </p>
                <div class="post-module">
                    ${post.picture?`<img src="${post.picture}" alt="${post.user.name}">`:`<div></div>`}
                </div>
            </div>
            <div class="like-comment-module">
                <small>
                    <a class="toggle-like-button" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post">
                        <ion-icon name="heart-outline"></ion-icon>&nbsp;${post.likes.length}
                    </a>   
                </small>
                <small>
                    <ion-icon class="comment-btn" name="chatbox-outline"></ion-icon>
                </small>
                <div class="post-comments toggle-commentbox">
                    <ion-icon class="close-btn" name="close"></ion-icon>
            
                    <div class="comment-module">
                        <div class="post-image">
                        ${post.picture?`<img src="${post.picture}" alt="${post.user.name}">`:
                        `<div class="outer">
                            <p class="post-content">
                                ${post.content}
                            </p>
                        </div> `}   
                        </div>
                        <div class="comment-section">
                            <a class="post-user" href="/users/profile/${post.user._id}">
                                <div class="profile">
                                    <img src="${post.user.avatar?post.user.avatar:`https://avatars.dicebear.com/api/avataaars/${post.user.name}.svg`}" alt="${post.user.name}" width="50">
                                </div>    
                                <h4>
                                    ${post.user.name}
                                </h4>   
                            </a>
                            <div class="post-comments-list">
                                <ul id="post-comments-${post._id}">
                                
                                </ul>
                            </div>
                            <form class="comment-form" id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                                <input type="text" name="content" placeholder="Add a comment..." required>
                                <input type="hidden" name="post" value="${post._id}" >
                                <input class="post-btn" type="submit" value="Post">
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </li>`)
        }

        let deletePost = function(deleteLink){
            $(deleteLink).click(function(e){
                e.preventDefault();

                $.ajax({
                    type: 'get',
                    url: $(deleteLink).prop('href'),
                    success: function(data){
                        $(`#post-${data.data.post_id}`).remove();
                        new Noty({
                            theme: 'sunset',
                            text: "Post Deleted",
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


        let convertPostsToAjax = function(){
            $('#posts-container>ul>li').each(function(){
                let self = $(this);
                let deleteButton = $(' .delete-post-button', self);
                deletePost(deleteButton);

                let postId = self.prop('id').split("-")[1];
                new PostComments(postId);
            });
        }

        createPost();
        convertPostsToAjax();
    })

}