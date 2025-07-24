import * as events from './constants/events';
import Emitter from './Emitter';
import close from './assets/close.svg';
import edit from './assets/edit.svg';

export default class View extends Emitter {
  constructor() {
    super();

    this.appPage = document.getElementById('main');
    this.addNewRecipeForm = document.getElementById('form-container');
    this.mainPage = document.getElementById('recipe');
    this.addNewRecipe = document.getElementById('add-new-recipe');
    this.favoritesPage = document.getElementById('favorites');
    this.submitButton = document.getElementById('submit');
    this.cancelButton = document.getElementById('cancel');
    this.userInputName = document.getElementById('user-input-name');
    this.userInputIngredients = document.getElementById('user-input-ingredients');
    this.userInputInstructions = document.getElementById('user-input-instructions');
    this.addEventListeners();
  }

  addEventListeners = () => {
    this.submitButton.addEventListener('click', this.handleSubmitButtonClick);
    this.cancelButton.addEventListener('click', this.handleCloseButtonClick);
    this.mainPage.addEventListener('click', this.handleRecipeButtonClick);
    this.addNewRecipe.addEventListener('click', this.handleAddNewRecipeButtonClick);
    this.favoritesPage.addEventListener('click', this.handleFavoritesButtonClick);
  };

  handleSubmitButtonClick = () => {
    if (this.addNewRecipeForm.hasAttribute('data-mode')) {
      const id = this.addNewRecipeForm.getAttribute('data-id');
      const data = this.getRecipeInfo();
      this.emit(events.ON_EDIT_MODE, id, data);
      this.addNewRecipeForm.removeAttribute('data-id');
    } else this.emit(events.CLICK_SUBMIT);
  };

  handleCloseButtonClick = () => {
    this.userInputName.value = '';
    this.userInputIngredients.value = '';
    this.userInputInstructions.value = '';
    this.addNewRecipeForm.style.display = 'none';
  };

  handleRecipeButtonClick = () => this.emit(events.CLICK_RECIPE);

  handleAddNewRecipeButtonClick = () => {
    this.addNewRecipeForm.style.display = 'block';
  };

  handleFavoritesButtonClick = () => {
    this.removeAllCards();
    this.emit(events.CLICK_FAVORITES);
  };

  getRecipeInfo = () => {
    const name = this.userInputName.value;
    const ingredients = this.userInputIngredients.value;
    const instructions = this.userInputInstructions.value;

    if (!name || !ingredients || !instructions) {
      alert('All fields are required');
      return null;
    }

    return {
      name,
      ingredients,
      instructions,
    };
  };

  printRecipeCard = (data, id, isFavorite) => {
    const { name, ingredients, instructions } = data;

    const recipeCard = document.createElement('article');
    recipeCard.classList.add('recipe-card');
    recipeCard.dataset.id = id;

    const recipeName = document.createElement('div');
    recipeName.classList.add('recipe-name');
    recipeName.innerHTML = name;

    const recipeIngredients = document.createElement('div');
    recipeIngredients.classList.add('recipe-ingredients');
    recipeIngredients.innerHTML = `
      <div class="recipe-cart-label">Ingredients:</div>
      <p class="recipe-text">${ingredients}</p>`;

    const recipeInstructions = document.createElement('div');
    recipeInstructions.classList.add('recipe-instruction');
    recipeInstructions.innerHTML = `
      <div class="recipe-cart-label">Instructions:</div>
      <p class="recipe-text">${instructions}</p>`;

    const footer = document.createElement('div');
    footer.classList.add('recipe-card-footer');

    this.appPage.appendChild(recipeCard);
    recipeCard.append(
      recipeName,
      recipeIngredients,
      recipeInstructions,
      document.createElement('hr'),
      footer
    );

    const favButton = document.createElement('button');
    favButton.classList.add('fav', 'icon');
    if (isFavorite) favButton.classList.add('clicked');
    favButton.innerHTML = `<span id="favorite" class="material-symbols-outlined">favorite</span>`;

    const editButton = document.createElement('button');
    editButton.classList.add('edit', 'icon');
    editButton.innerHTML = `<img src=${edit} alt="edit button">`;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete', 'icon');
    deleteButton.innerHTML = `<img src=${close} alt="delete button">`;

    favButton.addEventListener('click', () => {
      this.changefavButtonColor(favButton);
      this.isFavorite(id);
    });

    editButton.addEventListener('click', () => {
      this.emit(events.CLICK_EDIT, id);
    });

    deleteButton.addEventListener('click', () => {
      this.emit(events.CLICK_DELETE, id);
    });

    footer.append(favButton, editButton, deleteButton);

    this.handleCloseButtonClick();
  };

  changefavButtonColor = favButton => favButton.classList.toggle('clicked');

  isFavorite = id => {
    const targetCard = document.querySelector(`[data-id="${id}"]`);
    const targetIcon = targetCard.querySelector('.fav');
    if (targetIcon.classList.contains('clicked')) this.emit(events.CLICK_FAVORITE, id);
    else this.emit(events.CLICK_FAVORITE_TO_REMOVE, id);
  };

  showEditRecipeModal = obj => {
    const { _id, name, ingredients, instructions } = obj;
    this.addNewRecipeForm.style.display = 'block';
    this.addNewRecipeForm.setAttribute('data-mode', 'edit');
    this.addNewRecipeForm.setAttribute('data-id', `${_id}`);
    this.userInputName.value = name;
    this.userInputIngredients.value = ingredients;
    this.userInputInstructions.value = instructions;
  };

  removeAllCards = () => document.querySelectorAll('.recipe-card').forEach(e => e.remove());

  removeRecipeFromPage = id => document.querySelector(`[data-id="${id}"]`).remove();
}
