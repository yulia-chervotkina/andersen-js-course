import * as events from './constants/events';
import Emitter from './Emitter';

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

    this.userInputName = document.getElementById('user-input-name');
    this.userInputIngredients = document.getElementById('user-input-ingredients');
    this.userInputInstructions = document.getElementById('user-input-instructions');

    this.submitButton.addEventListener('submit', this.getRecipeInfo);
    this.cancelButton.addEventListener('click', () => {
      this.addNewRecipeForm.style.display = 'none';
    });
    this.addNewRecipe.addEventListener('click', () => {
      this.addNewRecipeForm.style.display = 'block';
    });
    this.favIcon.addEventListener('click', () => {
      // TO-DO: change svg color | 'unclick' to remove from the fav list
      this.favIcon.style.stroke = '#92B4F4';
      this.emit(events.CLICK_FAVORITE);
    });
    this.editIcon.addEventListener('click', this.emit(events.CLICK_EDIT));
    this.deleteIcon.addEventListener('click', this.emit(events.CLICK_DELETE));
  }

  getRecipeInfo = event => {
    event.preventDefault();
    const name = this.userInputName.value;
    const ingredients = this.userInputIngredients.value;
    const instructions = this.userInputInstructions.value;

    const recipe = {
      name,
      ingredients,
      instructions,
    };

    const jsonObject = JSON.stringify(recipe);
    this.emit(events.ON_RECIPE_INFO_GATHERED(jsonObject));
  };

  showEditRecipeModal = obj => {
    this.userInputName.value = obj.name;
    this.userInputIngredients.value = obj.ingredients;
    this.userInputInstructions.value = obj.instructions;

    this.addNewRecipeForm.style.diplay = 'block';
  };

  removeRecipeFromPage = () => {};
}
