import './styles/main.css';
import Controller from './Controller';
import View from './View';
import Model from './Model';
import EventEmitter from './EventEmitter';

const emitter = new EventEmitter();
const model = new Model(emitter);
const view = new View(emitter);
const app = new Controller(model, view, emitter);

document.addEventListener('DOMContentLoaded', () => {
  emitter.emit('onDOMLoaded');
});

export default app;
