import React, {useRef, useState} from 'react';
import './App.css';
import firebase from "firebase";
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from "react-firebase-hooks/auth";
import {useCollectionData} from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAUIg0IXDuTxC-t2ys1f0sqP0ykkqa-0gk",
  authDomain: "my-project-1487776295262.firebaseapp.com",
  databaseURL: "https://my-project-1487776295262.firebaseio.com",
  projectId: "my-project-1487776295262",
  storageBucket: "my-project-1487776295262.appspot.com",
  messagingSenderId: "37700010817",
  appId: "1:37700010817:web:388cc08178ef30e83497c0",
  measurementId: "G-QQ8WT3VEGG"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header><SignOut/></header>
      <section className="App-header">
        {user ? <ChatRoom /> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }
  return (
      <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
      <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const dummy = useRef()

  const sendMessage = async(e) => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL,
      uid
    })

    setFormValue('');

    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return (
      <>
        <main>
          <div>
            {messages && messages.map(msg => <ChatMessage Key={msg.id} message={msg}/>)}
          </div>
          <div ref={dummy}></div>
        </main>


        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} type="text"/>
          <button type="submit">Send</button>
        </form>
      </>
  )
}

function ChatMessage(props) {
  const {text, uid} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  const photoUrl = auth.currentUser.photoURL
  console.log(photoUrl)

  return (
      <div className={`message ${messageClass}`}>
        <img src={photoUrl} alt=""/>
        <p>{text}</p>
      </div>
  )
}

export default App;
