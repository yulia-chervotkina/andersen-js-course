import './styles/main.css';
import Controller from './Controller';
import View from './View';
import Emitter from './Emitter';

const emitter = new Emitter();
const view = new View();
const app = new Controller(view, emitter);
