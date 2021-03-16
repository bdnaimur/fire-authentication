import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './fireBaseConfig';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig);
function App() {
  const [signUser, setSignUser] = useState({
    isSigned: false,
    name: '',
    email: '',
    password: '',
    signUp: false,
    signIn: false,
    toggle: false
  })
  const handleBlur = (e) => {
    console.log(e.target.name, e.target.value);
    if (e.target.name === "email") {
      const emailInfo = { ...signUser };
      emailInfo[e.target.name] = e.target.value;
      setSignUser(emailInfo);
    }
    if (e.target.name === "password") {
      const passwordInfo = { ...signUser };
      passwordInfo[e.target.name] = e.target.value;
      setSignUser(passwordInfo);
    }

  }
  const handleSubmit = (e) => {
    console.log('Submit, clicked');
    firebase.auth().createUserWithEmailAndPassword(signUser.email, signUser.password)
      .then((userCredential) => {
        // Signed in 
        const submitInfo = {...signUser};
        submitInfo.isSigned = true;
        setSignUser(submitInfo);
        console.log('Own Sign In');
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });

    e.preventDefault();
  }
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const gitProvider = new firebase.auth.GithubAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const socialSignIn = (SocialProvider) => {
    firebase.auth().signInWithPopup(SocialProvider)
      .then((result) => {
        const signInfo = { ...signUser };
        signInfo.isSigned = true;
        setSignUser(signInfo);
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        console.log(result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }
  const socialSignOut = () => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      const signOutInfo = {...signUser};
      signOutInfo.isSigned = false;
    setSignUser(signOutInfo)
      console.log('Sign-out successful.');

    }).catch((error) => {
      // An error happened.
    });
  }
  const handleSignIn = () => {
    const signInInfo = {...signUser};
    signInInfo.signIn = true;
    signInInfo.toggle = true;
    setSignUser(signInInfo)
  }
  const handleSignUp = () => {
    const signUpInfo = {...signUser};
    signUpInfo.signUp = true;
    signUpInfo.toggle = false;
    setSignUser(signUpInfo)
  }
  return (
    <div className="App">
      {signUser.isSigned ? <button onClick={() => socialSignOut()}>Google Sign Out</button> : <button onClick={() => socialSignIn(googleProvider)}>Google Sign In</button>}
      <button onClick={() => socialSignIn(gitProvider)}>GitHub Sign In</button>
      <button onClick={() => socialSignIn(fbProvider)}>FaceBook Sign In</button>
      <h1>Our Own Authentication</h1>
      <button onClick={handleSignUp}>Sign Up</button>{signUser.isSigned ? <button onClick={() => socialSignOut()}>Sign Out</button>:<button onClick={handleSignIn}>Sign In</button>}
         {signUser.toggle ?
        <div>
          {signUser.signIn && <form onSubmit={handleSubmit}>
        <input onBlur={handleBlur} type="email" name="email" id="" required />
        <br />
        <input onBlur={handleBlur} type="password" name="password" id="" required />
        <br />
        <input type="submit" value="Submit" />
      </form>}
        </div> : 
      
      <div>
      {
        signUser.signUp && <form onSubmit={handleSubmit}>
        <input type="text" required />
        <br />
        <input onBlur={handleBlur} type="email" name="email" id="" required />
        <br />
        <input onBlur={handleBlur} type="text" name="password" id="" required />
        <br />
        <input type="submit" value="Enter" />
      </form>
      }
      </div>}
    </div>
  );
}
export default App;