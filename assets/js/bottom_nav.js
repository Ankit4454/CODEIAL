let home = document.getElementById('home-nav');
let chat = document.getElementById('chat-nav');
let search = document.getElementById('search-nav');
let homeSection = document.getElementById('feed-posts');
let chatSection = document.getElementById('profile-section');
let searchSection = document.getElementById('user-friends');

home.addEventListener('click', function(){
    homeSection.style.display = 'flex';
    chatSection.style.display = 'none';
    searchSection.style.display = 'none';
});

chat.addEventListener('click', function(){
    homeSection.style.display = 'none';
    chatSection.style.display = 'flex';
    searchSection.style.display = 'none';
});

search.addEventListener('click', function(){
    homeSection.style.display = 'none';
    chatSection.style.display = 'none';
    searchSection.style.display = 'block';
});

var btnContainer = document.getElementById("bottom-nav");
var btns = btnContainer.getElementsByClassName("btn");

for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}