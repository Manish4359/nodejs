import 'regenerator-runtime/runtime'
import { login } from './login';
import { signup } from './signup';

import { logout } from './logout';
import { displayMap } from './mapBox';
import {updateSettings} from './updateSettings';
//import {logout} from './logout'

const mapBox = document.querySelector('#map');
const loginForm = document.querySelector('.form-login-data');
const logoutBtn=document.querySelector('.nav__el--logout');
const userUpdateBtn=document.querySelector('.form-user-data');
const userUpdatePassBtn=document.querySelector('.form-user-settings');
const signupForm=document.querySelector('.form-signup-data');


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
if(userUpdateBtn){

    userUpdateBtn.addEventListener('submit',(e)=>{

        e.preventDefault();
        const name=document.getElementById('name').value;
        const email=document.getElementById('email').value;

        const data={
            name,
            email
        }
        updateSettings(data,'data');
    })
}

if(userUpdatePassBtn){

    userUpdatePassBtn.addEventListener('submit',async (e)=>{

        e.preventDefault();

        document.querySelector('.btn-save-pass').textContent='Updating...'

        const password=document.getElementById('password-current').value;
        const newPassword=document.getElementById('password').value;
        const newPasswordConfirm=document.getElementById('password-confirm').value;

        const data={
            password,
            newPassword,
            newPasswordConfirm
        }

        await updateSettings(data,'password');

        document.querySelector('.btn-save-pass').textContent='Save Password'

    })
}

if(signupForm){
    signupForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const name=document.getElementById('name').value;
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        const passwordConfirm=document.getElementById('password-confirm').value;

        signup({name,email,password,passwordConfirm});

    })
}