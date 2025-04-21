// scripts/auth.js
import {
    auth,
    provider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } from './firebase.js';
  
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      window.location.href = 'builder.html';
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  });
  
  document.getElementById('signupBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      window.location.href = 'builder.html';
    } catch (err) {
      alert('Signup failed: ' + err.message);
    }
  });
  
  document.getElementById('googleSignInBtn').addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = 'builder.html';
    } catch (err) {
      alert('Google sign-in failed: ' + err.message);
    }
  });
  