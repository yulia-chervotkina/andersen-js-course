import './styles/main.css';
import Controller from './Controller';
import View from './View';

const view = new View();
const app = new Controller(view, view);

app.init();
