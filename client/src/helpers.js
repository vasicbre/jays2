
function deactivateActiveClass() {
    document.querySelector('#home').classList.remove('active');
    document.querySelector('#profile').classList.remove('active');
    document.querySelector('#login').classList.remove('active');
}

export function toggleNavbarActivate(page) {
    deactivateActiveClass();
    switch(page) {
        case 'home':
            document.querySelector('#home').classList.add('active');
            break;
        case 'profile':
            document.querySelector('#profile').classList.add('active');
            break;
        case 'login':
            document.querySelector('#login').classList.add('active');
            break;
    }
}