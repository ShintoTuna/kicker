import * as firebase from 'firebase/app';
import 'firebase/database';

var config = {
    apiKey: 'AIzaSyCWJJf9n8qEpKv1EEleTcC60butLJ8rozg',
    authDomain: 'kicker-779af.firebaseapp.com',
    databaseURL: 'https://kicker-779af.firebaseio.com',
    projectId: 'kicker-779af',
    storageBucket: 'kicker-779af.appspot.com',
    messagingSenderId: '1056769390471'
};

const fb: firebase.app.App = firebase.initializeApp(config);

export default fb;
