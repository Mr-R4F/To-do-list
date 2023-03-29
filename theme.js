const SELECT_BOX    = document.getElementById('selectBox');
const TOGGLE        = document.getElementById('circle');
const BODY          = document.querySelector('body');
const THEME         = window.matchMedia('(prefers-color-scheme: dark)');

SELECT_BOX.onclick = function toggleTheme() {
    if(BODY.id === 'light') {
        BODY.id = 'dark';
        TOGGLE.style.left = '0';
        localStorage.setItem('Theme', BODY.id);
    } else {
        BODY.id = 'light';
        TOGGLE.style.left = '2rem';
        localStorage.setItem('Theme', BODY.id);
    }
}

THEME.onchange = function(e) {
    checkTheme(e);
}

function checkTheme(val) {
    if(val.matches) {
        BODY.id = 'dark';
        TOGGLE.style.left = '0';
    } else {
        BODY.id = 'light';
        TOGGLE.style.left = '2rem';
    }
}

function getTheme() {
    if(!localStorage.getItem('Theme')) {
        checkTheme(THEME);
        return;
    }

    BODY.id = localStorage.getItem('Theme');
    BODY.id === 'light' ? TOGGLE.style.left = '2rem' : TOGGLE.style.left = '0';
}