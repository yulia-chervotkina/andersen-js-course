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
      if (this.addNewRecipeForm.hasAttribute('data-mode')) {
        const id = this.addNewRecipeForm.getAttribute('data-id');
        const data = this.getRecipeInfo();
        // console.log('emitting the event with an id:', id);
        this.emit(events.ON_EDIT_MODE, id, data);
        this.addNewRecipeForm.removeAttribute('data-id');
      } else this.emit(events.CLICK_SUBMIT);
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
      // this.submitButton.type = 'submit';
      // TO-DO replace alert with styles
      alert('All fields are required');
      return null;
    }

    return {
      name,
      ingredients,
      instructions,
    };
  };

  // TO-DO change var name from jsonObject to something
  printRecipeCard = (jsonObject, id, isFavorite) => {
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
    // TO-DO they're both classes
    favIcon.setAttribute('class', 'fav');
    favIcon.classList.add('icon');
    if (isFavorite) favIcon.classList.add('clicked');
    favIcon.innerHTML = `<span id="favorite" class="material-symbols-outlined">favorite</span>`;
    footer.appendChild(favIcon);

    // favIcon event listener
    favIcon.addEventListener('click', () => {
      // this.emit(events.CLICK_FAVORITE, id);
      console.log('favIcon clicked');
      this.changeFavIconColor(favIcon);
      this.isFavorite(id);
      console.log('calling isFav with an id:', id);
    });

    const editIcon = document.createElement('button');
    editIcon.setAttribute('class', 'edit');
    editIcon.classList.add('icon');
    editIcon.innerHTML = `<img src=${edit} alt="edit button">`;
    footer.appendChild(editIcon);
    editIcon.addEventListener('click', () => {
      this.emit(events.CLICK_EDIT, id);
    });

    const deleteIcon = document.createElement('button');
    deleteIcon.setAttribute('class', 'close');
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
    console.log('favIcon color changed:', favIcon.classList.contains('clicked'));
  };

  isFavorite = id => {
    // console.log('isFav received an id:', id);
    const targetCard = document.querySelector(`[data-id="${id}"]`);
    // const targetCardsFooter = targetCard.querySelector('.recipe-card-footer');
    const targetIcon = targetCard.querySelector('.fav');
    // console.log('targetCard', targetCard);
    // console.log('targetCardsFooter', targetCardsFooter);
    // console.log('targetIcon', targetIcon);
    // console.log(targetIcon.classList.contains('clicked'));
    if (targetIcon.classList.contains('clicked')) this.emit(events.CLICK_FAVORITE, id);
    else this.emit(events.CLICK_FAVORITE_TO_REMOVE, id);
  };

  closeRecipeForm = () => {
    this.userInputName.value = '';
    this.userInputIngredients.value = '';
    this.userInputInstructions.value = '';
    this.addNewRecipeForm.style.display = 'none';
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

  removeAllCards = () => {
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(e => e.remove());
  };

  removeRecipeFromPage = id => {
    const recipeToDelete = document.querySelector(`[data-id="${id}"]`);
    recipeToDelete.remove();
  };
}
