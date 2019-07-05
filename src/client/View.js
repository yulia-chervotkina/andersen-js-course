/* eslint-disable no-undef */
import * as EVENTS from './constants/events';
import EventEmitter from './EventEmitter';
import favImg from './images/favorite.svg';
import enabledFavImg from './images/favorite-enabled.svg';
import editImg from './images/edit.svg';
import delImg from './images/delete.svg';

class View extends EventEmitter {
  constructor() {
    super();

    this.initializeElements();
    this.addEventListeners();
  }

  initializeElements() {
    const d = document;

    this.modalNewRecipe = d.getElementById('newRecipe');
    this.modalEditRecipe = d.getElementById('editRecipe');
    this.modalError = d.getElementById('error');
    this.recipeList = d.querySelector('.recipe-list').querySelector('.row');
  }

  addEventListeners() {
    const d = document;

    window.addEventListener('error', e => {
      const message = e.error.toString();
      this.modalError.querySelector('.modal-body').innerHTML = message;
      this.showErrorModal();
    });

    const homeBtn = d.querySelector('.navbar-brand');
    const newRecipeBtn = d.querySelector('.new-recipe');
    const favoritesBtn = d.querySelector('.favorites');
    const submEditBtn = this.modalEditRecipe.querySelector('[type=submit]');
    const submNewRecipeBtn = this.modalNewRecipe.querySelector('[type=submit]');
    const cancelNewRecipeBtn = this.modalNewRecipe.querySelector('[type=reset]');
    const cancelEditRecipeBtn = this.modalEditRecipe.querySelector('[type=reset]');
    const closeNewRecipeBtn = this.modalNewRecipe.querySelector('.close');
    const closeEditRecipeBtn = this.modalEditRecipe.querySelector('.close');
    const cancelErrorBtn = this.modalError.querySelector('.btn');
    const closeErrorBtn = this.modalError.querySelector('.close');

    homeBtn.addEventListener('click', this.handleShowAll.bind(this));
    newRecipeBtn.addEventListener('click', this.showNewRecipeModal.bind(this));
    favoritesBtn.addEventListener('click', this.handleShowFavorites.bind(this));
    submEditBtn.addEventListener('click', this.handleEditRecipe.bind(this));
    submNewRecipeBtn.addEventListener('click', this.handleCreateRecipe.bind(this));
    cancelNewRecipeBtn.addEventListener('click', this.hideNewRecipeModal.bind(this));
    closeNewRecipeBtn.addEventListener('click', this.hideNewRecipeModal.bind(this));
    closeEditRecipeBtn.addEventListener('click', this.hideEditRecipeModal.bind(this));
    cancelEditRecipeBtn.addEventListener('click', this.hideEditRecipeModal.bind(this));
    cancelErrorBtn.addEventListener('click', this.hideErrorModal.bind(this));
    closeErrorBtn.addEventListener('click', this.hideErrorModal.bind(this));
  }

  addRecipeListeners(fav, edit, del) {
    fav.addEventListener('click', this.handleFavorite.bind(this));
    edit.addEventListener('click', this.showEditRecipeModal.bind(this));
    del.addEventListener('click', this.handleDeleteRecipe.bind(this));
  }

  removeRecipeListeners(card) {
    const fav = card.querySelector('.favorite');
    const edit = card.querySelector('.edit');
    const del = card.querySelector('.delete');
    fav.removeEventListener('click', this.handleFavorite.bind(this));
    edit.removeEventListener('click', this.showEditRecipeModal.bind(this));
    del.removeEventListener('click', this.handleDeleteRecipe.bind(this));
  }

  showNewRecipeModal(e) {
    e.preventDefault();
    this.modalNewRecipe.style.display = 'flex';
  }

  hideNewRecipeModal() {
    const d = document;
    d.getElementById('name').value = '';
    d.getElementById('ingredients').value = '';
    d.getElementById('instructions').value = '';
    this.modalNewRecipe.style.display = 'none';
  }

  hideErrorModal() {
    this.modalError.style.display = 'none';
  }

  showErrorModal() {
    this.modalError.style.display = 'flex';
  }

  showEditRecipeModal({ target }) {
    const d = document;
    const card = target.parentNode.parentNode;
    const name = d.getElementById('editName');
    const ingredients = d.getElementById('editIngredients');
    const instruction = d.getElementById('editInstructions');

    // заполняем поля для окна редактирования, и прячем ID рецепта в поле name.

    name.setAttribute('card-id', card.getAttribute('card-id'));
    name.value = card.querySelector('.card-title').innerText;
    ingredients.value = card.querySelector('.ingredients').innerText;
    instruction.value = card.querySelector('.instruction').innerText;
    this.modalEditRecipe.style.display = 'flex';
  }

  hideEditRecipeModal() {
    this.modalEditRecipe.style.display = 'none';
  }

  handleShowAll(e) {
    e.preventDefault();
    while (this.recipeList.lastChild) {
      this.recipeList.removeChild(this.recipeList.lastChild);
    }
    this.recipeList.classList.remove('favorite');
    this.emit(EVENTS.ALL);
  }

  handleShowFavorites(e) {
    e.preventDefault();
    while (this.recipeList.lastChild) {
      this.recipeList.removeChild(this.recipeList.lastChild);
    }
    this.recipeList.classList.add('favorite');
    this.emit(EVENTS.FAVORITES);
  }

  handleCreateRecipe(e) {
    e.preventDefault();
    const d = document;
    const name = d.getElementById('name').value;
    const ingredients = d.getElementById('ingredients').value;
    const instruction = d.getElementById('instructions').value;

    // id создает БД, получим из ответа сервера

    this.emit(EVENTS.ADD, {
      name,
      ingredients,
      instruction,
      favorite: false,
    });
  }

  handleEditRecipe(e) {
    e.preventDefault();
    const d = document;

    // достаем ID из поля name.

    const name = d.getElementById('editName');
    const id = name.getAttribute('card-id');
    const ingredients = d.getElementById('editIngredients').value;
    const instruction = d.getElementById('editInstructions').value;
    this.emit(EVENTS.EDIT, {
      name: name.value,
      id,
      ingredients,
      instruction,
    });
  }

  handleFavorite({ target }) {
    const card = target.parentNode.parentNode;
    const id = card.getAttribute('card-id');
    if (card.getAttribute('favorite') === 'false') {
      this.addToFavorites(card, id, target);
    } else {
      this.delFromFavorites(card, id, target);
    }
  }

  handleDeleteRecipe({ target }) {
    const card = target.parentNode.parentNode;
    const id = card.getAttribute('card-id');
    this.emit(EVENTS.DELETE, { id });
  }

  addRecipe({ name, _id, ingredients: ingr, instruction: instr, favorite }) {
    // собираем карточку и присоеднияем к DOM

    this.hideNewRecipeModal();
    const d = document;

    const title = d.createElement('h3');
    title.classList.add('card-title', 'text-center');
    title.innerText = name;

    const ingrSubtitle = d.createElement('h5');
    ingrSubtitle.classList.add('card-subtitle');
    ingrSubtitle.innerText = 'Ingredients:';

    const ingredients = d.createElement('p');
    ingredients.classList.add('card-text', 'ingredients');
    ingredients.innerText = ingr;

    const instrSubtitle = d.createElement('h5');
    instrSubtitle.classList.add('card-subtitle');
    instrSubtitle.innerText = 'Instruction:';

    const instruction = d.createElement('p');
    instruction.classList.add('card-text', 'instruction');
    instruction.innerText = instr;

    const newCardBody = d.createElement('div');
    newCardBody.classList.add('card-body');
    newCardBody.appendChild(title);
    newCardBody.appendChild(ingrSubtitle);
    newCardBody.appendChild(ingredients);
    newCardBody.appendChild(instrSubtitle);
    newCardBody.appendChild(instruction);

    const favButton = d.createElement('img');
    favButton.classList.add('favorite', 'img');
    if (favorite) {
      favButton.setAttribute('src', enabledFavImg);
    } else {
      favButton.setAttribute('src', favImg);
    }
    favButton.setAttribute('alt', 'favorite');

    const editButton = d.createElement('img');
    editButton.classList.add('edit', 'img');
    editButton.setAttribute('src', editImg);
    editButton.setAttribute('alt', 'edit');

    const delButton = d.createElement('img');
    delButton.classList.add('delete', 'img');
    delButton.setAttribute('src', delImg);
    delButton.setAttribute('alt', 'delete');

    this.addRecipeListeners(favButton, editButton, delButton);

    const newCardFooter = d.createElement('div');
    newCardFooter.classList.add('card-footer');

    newCardFooter.appendChild(favButton);
    newCardFooter.appendChild(editButton);
    newCardFooter.appendChild(delButton);

    const newCard = d.createElement('div');
    newCard.classList.add('card');
    newCard.setAttribute('card-id', _id);
    newCard.setAttribute('favorite', `${favorite}`);
    newCard.appendChild(newCardBody);
    newCard.appendChild(newCardFooter);

    const newCol = d.createElement('div');
    newCol.classList.add('col-md-4', 'col-lg-4', 'col-sm-12');
    newCol.appendChild(newCard);

    this.recipeList.appendChild(newCol);
  }

  editRecipe({ name, id, ingredients, instruction }) {
    this.hideEditRecipeModal();
    const card = this.recipeList.querySelector(`[card-id='${id}']`);
    card.querySelector('.card-title').innerText = name;
    card.querySelector('.ingredients').innerText = ingredients;
    card.querySelector('.instruction').innerText = instruction;
  }

  removeRecipe(id) {
    const card = this.recipeList.querySelector(`[card-id='${id}']`);
    this.removeRecipeListeners(card);
    this.recipeList.removeChild(card.parentNode);
  }

  addToFavorites(card, id, img) {
    this.emit(EVENTS.EDIT, { id, favorite: true });
    img.setAttribute('src', enabledFavImg);
    card.setAttribute('favorite', 'true');
  }

  delFromFavorites(card, id, img) {
    this.emit(EVENTS.EDIT, { id, favorite: false });
    img.setAttribute('src', favImg);
    card.setAttribute('favorite', 'false');

    // если находимся на страничке избранных рецептов, удаляем рецепт из списка

    if (this.recipeList.classList.contains('favorite')) {
      this.removeRecipe(id);
    }
  }

  showRecipes(recipes) {
    recipes.forEach(recipe => {
      this.addRecipe(recipe);
    });
  }
}

export default View;
