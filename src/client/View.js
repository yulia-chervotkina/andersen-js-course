import * as events from './constants/events';
import Emitter from './Emitter';
import close from './assets/close.svg';
import edit from './assets/edit.svg';
// import favFocused from './assets/favorite_focus.svg';

export default class View extends Emitter {
  constructor() {
    super();

    this.appPage = document.getElementById('main');
    this.recipeCardContainer = document.getElementById('recipe-cards-container');
    this.addNewRecipeForm = document.getElementById('form-container');
    this.mainPage = document.getElementById('recipe');
    this.addNewRecipe = document.getElementById('add-new-recipe');
    this.favoritesPage = document.getElementById('favorites');
    this.submitButton = document.getElementById('submit');
    this.cancelButton = document.getElementById('cancel');
    this.favIcon = window.document.getElementById('fav');
    this.editIcon = document.getElementById('edit');
    this.deleteIcon = window.document.getElementById('close');
    this.userInputName = document.getElementById('user-input-name');
    this.userInputIngredients = document.getElementById('user-input-ingredients');
    this.userInputInstructions = document.getElementById('user-input-instructions');

    this.submitButton.addEventListener('click', () => {
      this.getRecipeInfo();
    });
    this.cancelButton.addEventListener('click', this.closeRecipeForm);
    this.mainPage.addEventListener('click', () => {
      this.emit(events.CLICK_RECIPE);
    });
    this.addNewRecipe.addEventListener('click', () => {
      this.addNewRecipeForm.style.display = 'block';
    });
    this.favoritesPage.addEventListener('click', () => {
      this.removeAllCards();
      this.emit(events.CLICK_FAVORITES);
    });
  }

  getRecipeInfo = () => {
    const name = this.userInputName.value;
    const ingredients = this.userInputIngredients.value;
    const instructions = this.userInputInstructions.value;

    if (name === '' || ingredients === '' || instructions === '') {
      // TO-DO replace alert with styles
      alert('All fields are required');
      return;
    }

    const recipe = {
      name,
      ingredients,
      instructions,
    };

    const jsonObject = JSON.stringify(recipe);
    this.emit(events.ON_RECIPE_INFO_GATHERED, jsonObject);
  };

  // TO-DO change var name from jsonObject to something
  printRecipeCard = (jsonObject, id) => {
    const { name, ingredients, instructions } = jsonObject;
    // <article class="recipe-card">

    const recipeCard = document.createElement('article');
    recipeCard.classList.add('recipe-card');
    recipeCard.dataset.id = id;
    this.appPage.appendChild(recipeCard);

    // <div class="recipe-name">

    const recipeName = document.createElement('div');
    recipeName.classList.add('recipe-name');
    recipeName.innerHTML = name;
    recipeCard.appendChild(recipeName);

    // <div class="recipe-ingredients">

    const recipeIngredients = document.createElement('div');
    recipeIngredients.classList.add('recipe-ingredients');
    recipeIngredients.innerHTML = `
      <div class="recipe-cart-label">Ingredients:</div>
      <p class="recipe-text">${ingredients}</p>`;
    recipeCard.appendChild(recipeIngredients);

    //  <div class="recipe-instruction">

    const recipeInstructions = document.createElement('div');
    recipeInstructions.classList.add('recipe-instruction');
    recipeInstructions.innerHTML = `
    <div class="recipe-cart-label">Instructions:</div>
    <p class="recipe-text">${instructions}</p>`;
    recipeCard.appendChild(recipeInstructions);

    recipeCard.appendChild(document.createElement('hr'));

    // <div class="recipe-card-footer">

    const footer = document.createElement('div');
    footer.classList.add('recipe-card-footer');
    recipeCard.appendChild(footer);

    const favIcon = document.createElement('button');
    favIcon.setAttribute('id', 'fav');
    favIcon.classList.add('icon');
    favIcon.innerHTML = `<span id="favorite" class="material-symbols-outlined">favorite</span>`;
    footer.appendChild(favIcon);
    favIcon.addEventListener('click', () => {
      this.emit(events.CLICK_FAVORITE, id);
      this.changeFavIconColor(favIcon);
    });

    const editIcon = document.createElement('button');
    editIcon.setAttribute('id', 'edit');
    editIcon.classList.add('icon');
    editIcon.innerHTML = `<img src=${edit} alt="edit button">`;
    footer.appendChild(editIcon);

    editIcon.addEventListener('click', () => {
      this.emit(events.CLICK_EDIT, id);
    });

    const deleteIcon = document.createElement('button');
    deleteIcon.setAttribute('id', 'close');
    deleteIcon.classList.add('icon');
    deleteIcon.innerHTML = `<img src=${close} alt="close button">`;
    footer.appendChild(deleteIcon);

    deleteIcon.addEventListener('click', () => {
      this.emit(events.CLICK_DELETE, id);
    });

    this.closeRecipeForm();
  };

  changeFavIconColor = favIcon => {
    favIcon.classList.toggle('clicked');
  };

  closeRecipeForm = () => {
    this.userInputName.value = '';
    this.userInputIngredients.value = '';
    this.userInputInstructions.value = '';
    this.addNewRecipeForm.style.display = 'none';
  };

  showEditRecipeModal = obj => {
    this.addNewRecipeForm.style.diplay = 'block';
    this.userInputName.value = obj.name;
    this.userInputIngredients.value = obj.ingredients;
    this.userInputInstructions.value = obj.instructions;
  };

  removeAllCards = () => {
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(e => e.remove());
  };

  removeRecipeFromPage = id => {
    const recipeToDelete = document.querySelector(`[data-id="${id}"]`);
    recipeToDelete.remove();
  };
}
