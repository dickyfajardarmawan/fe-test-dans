import React from 'react'
import { signInWithPopup, GoogleAuthProvider, provider, auth } from '../service/firebase'
import {useNavigate,} from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
  const login = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user)
            localStorage.setItem('user', JSON.stringify(user))
            navigate('/')
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}
  return (
    <div className='text-center' style={{marginTop: '200px'}}>
        <button className='btn btn-primary' onClick={login}>Login With Google</button>
    </div>
  )
}

export default LoginPage