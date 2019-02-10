import firebase from "firebase/app"

// Initialize Firebase
const config: object = {
    apiKey: "AIzaSyDikYhcdB7jzBCTWTcQd63liTFWdb1-pP4",
    authDomain: "mystia-shino.firebaseapp.com",
    databaseURL: "https://mystia-shino.firebaseio.com",
    projectId: "mystia-shino",
    storageBucket: "mystia-shino.appspot.com",
    messagingSenderId: "714833541931"
};
export default firebase.initializeApp(config);