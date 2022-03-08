import 'regenerator-runtime/runtime'
import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapBox';
//import {logout} from './logout'

const mapBox = document.querySelector('#map');
const loginForm = document.querySelector('.form-login-data');
const logoutBtn=document.querySelector('.nav__el--logout');
const accountBtn=document.querySelector('.qwerty')


if (mapBox) {
    
    locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    })
} 

if(logoutBtn){

    logoutBtn.addEventListener('click',()=>{
        logout();
    })
} 
