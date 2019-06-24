import './styles/main.css';
import { CHANGE } from './constants/events';
import Model from './Model';
import View from './View';
import Controller from './Controller';
import { save, load } from './utilities/utilities';

document.addEventListener('DOMContentLoaded', () => {
  const state = load();
  const model = new Model(state || undefined);
  model.on(CHANGE, newState => save(newState));
  const view = new View();
  const controller = new Controller(model, view);
});
