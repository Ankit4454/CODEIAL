let chatBtn = document.getElementById('chat-btn');
let profileSection = document.getElementById('profile-section');
let sideNav = document.getElementById('side-nav');
let closeNavBtn = document.getElementById('close-btn');
let searchBtn = document.getElementById('search-btn');
let userSection = document.getElementById('user-friends');
let closeUserBtn = document.getElementById('closeUser-btn');

chatBtn.addEventListener('click', function(){
    profileSection.style.left = '0';
});

closeNavBtn.addEventListener('click', function(){
    profileSection.style.left = '-40%';
});

searchBtn.addEventListener('click', function(){
    userSection.style.right = '0';
});

closeUserBtn.addEventListener('click', function(){
    userSection.style.right = '-35%';
});