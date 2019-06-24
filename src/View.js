import * as EVENTS from './constants/events';
import * as ERRORS from './constants/errors';
import * as utils from './utilities/utilities';
import * as dnd from './utilities/dnd';
import EventEmitter from './EventEmitter';

class View extends EventEmitter {
  constructor() {
    super();

    this.initializeElements();
    this.fillInventories();
    this.addEventListeners();
  }

  initializeElements() {
    const d = document;

    this.inventories = [
      d.getElementById('itemInv'),
      d.getElementById('forgeInv'),
      d.getElementById('recipeInv'),
      d.getElementById('newRecipeInv'),
    ];

    this.window = d.querySelector('.window');
    this.modal = d.querySelector('.modal');
    this.forgeRecipeSlot = d.querySelector('.forgeRecipeSlot');
    this.newRecipeWindow = d.querySelector('.newRecipeWindow');
    this.infoWindow = d.querySelector('.infoWindow');
    this.errorWindow = d.querySelector('.errorWindow');

    this.forgeRecipeSlot.setAttribute('free', 'true');
  }

  addEventListeners() {
    const d = document;

    window.addEventListener('error', e => {
      const message = e.error.toString();
      this.errorWindow.querySelector('.errorMsg').innerHTML = message;
      this.showErrorWindow();
    });

    const trashZone = d.querySelector('.trashZone');
    const forgeBtn = d.getElementById('forgeBtn');
    const mineBtn = d.getElementById('mineBtn');
    const newRecipeBtn = d.querySelector('.newRecipeBtn');
    const cancelRecipeBtn = d.getElementById('cancelRecipeBtn');
    const createRecipeBtn = d.getElementById('createRecipeBtn');
    const infoBtn = d.getElementById('infoBtn');
    const modalCloseBtns = utils.takeItemsFrom(this.modal, '.closeBtn');

    infoBtn.addEventListener('click', this.showInfoWindow.bind(this));

    forgeBtn.addEventListener('click', this.handleForgeItem.bind(this));

    mineBtn.addEventListener('click', this.handleMine.bind(this));

    newRecipeBtn.addEventListener('click', this.showNewRecipeWindow.bind(this));

    cancelRecipeBtn.addEventListener('click', this.hideNewRecipeWindow.bind(this));

    createRecipeBtn.addEventListener('click', this.handleCreateRecipe.bind(this));

    this.modal.addEventListener('click', this.hideModalWindow.bind(this));

    modalCloseBtns.forEach(elem => {
      elem.addEventListener('click', this.hideModalWindow.bind(this));
    });

    [...this.inventories, this.forgeRecipeSlot].forEach(elem => {
      elem.addEventListener('dragstart', dnd.handleDragStart.bind(this));
      elem.addEventListener('dragover', dnd.handleDragOver.bind(this));
      elem.addEventListener('drop', dnd.handleDrop.bind(this));
      elem.addEventListener('dragend', dnd.handleDragEnd.bind(this));
    });

    trashZone.addEventListener('dragover', dnd.handleDragOver.bind(this));
    trashZone.addEventListener('drop', dnd.handleDropTrash.bind(this));
  }

  handleMine() {
    this.emit(EVENTS.MINE);
  }

  handleForgeItem() {
    const [, forgeInv, recipeInv] = this.inventories;
    const itemsArray = utils.takeItemsFrom(forgeInv, '.item');
    if (itemsArray.length === 0) {
      throw new Error(ERRORS.NO_INGR);
    }

    const itemIds = itemsArray.map(elem => elem.getAttribute('item-id'));
    const itemNames = itemsArray.map(elem => elem.innerText);

    const recipe = this.forgeRecipeSlot.querySelector('.recipe');
    if (!recipe) {
      throw new Error(ERRORS.NO_RECIPE);
    }
    const recipeId = recipe.getAttribute('item-id');
    this.emit(EVENTS.FORGE, { recipeId, itemIds, itemNames });

    View.moveItem(recipe, recipeInv);
  }

  handleCreateRecipe() {
    const [, , , newRecipeInv] = this.inventories;
    const itemsArray = utils.takeItemsFrom(newRecipeInv, '.item');
    if (itemsArray.length === 0) {
      throw new Error(ERRORS.NO_INGR);
    }

    const itemIds = itemsArray.map(elem => elem.getAttribute('item-id'));
    const itemNames = itemsArray.map(elem => elem.innerText);

    const recipeNameInput = this.newRecipeWindow.querySelector('.newRecipeName');
    const recipeName = recipeNameInput.value;
    if (!recipeName) {
      throw new Error(ERRORS.NO_NAME);
    }
    this.emit(EVENTS.CREATE, { recipeName, itemNames, itemIds });
    this.hideNewRecipeWindow();
    recipeNameInput.value = '';
  }

  showInfoWindow() {
    this.modal.style.display = 'flex';
    this.infoWindow.style.display = 'flex';
  }

  showErrorWindow() {
    this.modal.style.display = 'flex';
    this.errorWindow.style.display = 'block';
  }

  hideModalWindow(e) {
    this.modal.style.display = 'none';
    if (e.target !== this.modal) {
      e.target.parentNode.style.display = 'none';
    }
    this.infoWindow.style.display = 'none';
    this.errorWindow.style.display = 'none';
  }

  showNewRecipeWindow() {
    this.newRecipeWindow.style.display = 'flex';
  }

  hideNewRecipeWindow() {
    this.newRecipeWindow.style.display = 'none';
  }

  fillInventories() {
    const [itemInv, forgeInv, recipeInv, newRecipeInv] = this.inventories;

    const recipeInvFragm = utils.createDOMFragmentWith(23, utils.createSlot);
    const itemInvFragm = utils.createDOMFragmentWith(20, utils.createSlot);
    const forgeInvFragm = utils.createDOMFragmentWith(8, utils.createSlot);
    const newRecipeInvFragm = utils.createDOMFragmentWith(8, utils.createSlot);

    itemInv.appendChild(itemInvFragm);
    forgeInv.appendChild(forgeInvFragm);
    newRecipeInv.appendChild(newRecipeInvFragm);
    recipeInv.appendChild(recipeInvFragm);
  }

  addItem({ name, id, requre, forged, color }) {
    const [itemInv, , recipeInv] = this.inventories;

    const item = document.createElement('div');
    item.innerText = name;
    item.setAttribute('item-id', id);
    item.setAttribute('draggable', 'true');
    // Определяем, какого типа предмет
    if (forged) {
      item.classList.add('item');
      item.style.background = color;
      View.moveItem(item, itemInv);
    } else if (requre) {
      item.classList.add('recipe');
      View.moveItem(item, recipeInv);
    } else {
      item.classList.add('item', name);
      View.moveItem(item, itemInv);
    }
  }

  handleRemoveItem(id) {
    this.emit(EVENTS.REMOVE, { id });
  }

  removeItem(id) {
    const elem = this.window.querySelector(`div[item-id='${id}']`);

    const elemParent = elem.parentNode;

    elemParent.removeChild(elem);
    elemParent.setAttribute('free', 'true');
  }

  static moveItem(item, place) {
    const slots = utils.takeItemsFrom(place, '.slot');
    const freeSlot = slots.find(element => element.getAttribute('free') === 'true');

    if (!freeSlot) {
      throw new Error(ERRORS.NO_SPACE);
    }

    if (item.parentNode) {
      item.parentNode.setAttribute('free', 'true');
    }

    freeSlot.appendChild(item);
    freeSlot.setAttribute('free', 'false');
  }

  showItems(data) {
    data.forEach(item => this.addItem(item));
  }
}

export default View;
