var nav = document.querySelector('.main-nav__items');
var toggle = document.querySelector('.toggle_open-bar');
var close = document.querySelector('.toggle_close-bar');


toggle.addEventListener('click', function(event) {
     event.preventDefault();
     nav.classList.add('main-nav__items_open');
     toggle.classList.remove('toggle_open-bar');
});

close.addEventListener('click', function(event) {
    event.preventDefault();
    nav.classList.remove('main-nav__items_open');
    toggle.classList.add('toggle_open-bar');
});
