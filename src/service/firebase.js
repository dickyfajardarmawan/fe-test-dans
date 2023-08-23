// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAjAlvJz6HvGxBWMewBphK3vM0e6QcMnnw",
  authDomain: "myproject-7bc9d.firebaseapp.com",
  databaseURL: "https://myproject-7bc9d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myproject-7bc9d",
  storageBucket: "myproject-7bc9d.appspot.com",
  messagingSenderId: "979442305434",
  appId: "1:979442305434:web:6b0aa5c2890832a8225223",
  measurementId: "G-SYKVEDYX3K"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();




// const logout = () => {
//     signOut(auth).then(() => {
//         console.log('sign out success')
//         // Sign-out successful.
//       }).catch((error) => {
//         // An error happened.
//       });
// }

export {
    auth,
    provider,
    GoogleAuthProvider,
    signOut,
    signInWithPopup
}