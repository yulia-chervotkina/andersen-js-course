import './client/styles/main.css'; 
import Controller from './client/Controller.js';
import View from './client/View.js';
import Emitter from './client/Emitter.js';

const emitter = new Emitter();
const view = new View();
const app = new Controller(view, emitter);

console.log("The app is running...")