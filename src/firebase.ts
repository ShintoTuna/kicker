import * as firebase from 'firebase/app';
import 'firebase/firestore';

var config = {
    apiKey: 'AIzaSyCWJJf9n8qEpKv1EEleTcC60butLJ8rozg',
    authDomain: 'kicker-779af.firebaseapp.com',
    databaseURL: 'https://kicker-779af.firebaseio.com',
    projectId: 'kicker-779af',
    storageBucket: 'kicker-779af.appspot.com',
    messagingSenderId: '1056769390471'
};

firebase.initializeApp(config);

var db = firebase.firestore();

export default db;
