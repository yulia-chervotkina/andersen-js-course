import * as events from './constants/events.js';
import Emitter from './Emitter.js';

export default class View extends Emitter {
  constructor() {
    super();

    this.addNewRecipeForm = document.getElementById('form-container');
    this.mainPage = document.getElementById('recipe');
    this.addNewRecipe = document.getElementById('add-new-recipe');
    this.favoritesPage = document.getElementById('favorites');
    this.submitButton = document.getElementById('submit');
    this.cancelButton = document.getElementById('cancel');
    this.favIcon = document.getElementById('favorite');
    this.editIcon = document.getElementById('edit');
    this.deleteIcon = document.getElementById('close');
    addEventListeners();
  }

  addEventListeners = () => {
    mainPage.addEventListener('click', events.CLICK_RECIPE);
    addNewRecipe.addEventListener('click', () => (this.addNewRecipeForm.display = 'block'));
    favoritesPage.addEventListener('click', events.CLICK_FAVORITES);
    submit.addEventListener('click', events.CLICK_SUBMIT);
    cancel.addEventListener('click', this.cancel);
    favIcon.addEventListener('click', events.CLICK_FAVORITE);
    editIcon.addEventListener('click', () => (this.addNewRecipeForm.display = 'block'));
    deleteIcon.addEventListener('click', events.CLICK_DELETE);
  };

  cancel = () => {
    this.addNewRecipeForm.display = 'none';
  };

  submit = () => {};
}
