import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBTOfj1YdHpvwhRJwB8799Z4AtW0xz-198",
    authDomain: "dsbook-list.firebaseapp.com",
    projectId: "dsbook-list",
    storageBucket: "dsbook-list.appspot.com",
    messagingSenderId: "342624186839",
    appId: "1:342624186839:web:cebf1f083c42b4c6b9db92"
};

// init firebase
firebase.initializeApp(firebaseConfig);
// init services
const db = firebase.firestore()
const storage = firebase.storage()
const timestamp = firebase.firestore.FieldValue.serverTimestamp
const auth = firebase.auth()

export { db, timestamp, auth, storage }