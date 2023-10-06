import '@babel/polyfill';
import { login } from './login';

//Dom elements
const loginForm = document.querySelector('.form');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
