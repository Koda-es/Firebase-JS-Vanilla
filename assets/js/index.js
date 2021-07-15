import Html from './modules/html.js';
import Firebase from './modules/firebase.js';

import Home from './modules/home.js';

const html = new Html();

const firebase = new Firebase();

const home = new Home(firebase, html);