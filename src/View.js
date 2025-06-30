import { EVENT_TYPES } from './EventEmitter';

const dropPermissionMap = {
  ore: ['trash', 'inventory', 'craft-slots', 'create-new-recipe'],
  recipe: ['trash', 'recipe-template'],
  item: ['trash', 'inventory', 'craft-slots', 'create-new-recipe'],
};

export default class View {
  constructor(emitter) {
    this.emitter = emitter;

    this.inventoryContainer = document.getElementById('inventory');
    this.recipeSlots = document.querySelector('.recipe');
    this.newRecipeContainer = document.getElementById('new-recipe');
    this.craftingContainer = document.getElementById('craft-slots');
    this.newRecipeSlots = document.getElementById('create-new-recipe');
    this.recipeContainer = document.getElementById('recipe');
    this.recipeTemplate = document.getElementById('recipe-template');

    this.slotContainers = {
      inventory: this.inventoryContainer,
      recipe: this.recipeSlots,
      forge: this.craftingContainer,
      newRecipe: this.newRecipeSlots,
      trash: this.trashZone,
      recipeTemplate: this.recipeTemplate,
    };

    this.emitter.on(EVENT_TYPES.SLOTS_CREATED, this.displaySlots);

    this.mineButton = document.getElementById('mine-button');
    this.inventorySlotDiv = document.querySelectorAll('.ore');
    this.infoButton = document.getElementById('display-button');
    this.closeButton = document.getElementById('close-button');
    this.modal = document.getElementById('ruleset');
    this.addNewRecipeButton = document.getElementById('add-recipe');
    this.cancelButton = document.getElementById('cancel');
    this.createNewRecipeButton = document.getElementById('create');
    this.inventorySlot = document.querySelector('.inventory');
    this.draggableOre = document.getElementsByTagName('button');
    this.trashZone = document.getElementById('trash');
    this.forgeButton = document.getElementById('forge');
    this.recipeNameElement = document.getElementById('recipe-name');

    this.infoButton.addEventListener('click', () => (this.modal.style.display = 'block'));
    this.closeButton.addEventListener('click', () => (this.modal.style.display = 'none'));
    this.addNewRecipeButton.addEventListener('click', () => {
      this.newRecipeContainer.style.display = 'block';
      this.recipeContainer.replaceWith(this.newRecipeContainer);
      this.emitter.emit(EVENT_TYPES.CLICK_ADD);
    });
    this.cancelButton.addEventListener('click', () => {
      this.emitter.emit(EVENT_TYPES.CLICK_CANCEL);
      this.newRecipeContainer.replaceWith(this.recipeContainer);
    });
    this.createNewRecipeButton.addEventListener('click', this.saveNewRecipeInfo);

    this.mineButton.addEventListener('click', () => this.emitter.emit(EVENT_TYPES.CLICK_MINE));
    this.forgeButton.addEventListener('click', () => this.emitter.emit(EVENT_TYPES.CLICK_FORGE));

    this.addEventListenerOnDrop();
  }

  displaySlots = ({ areaName, slots }) => {
    const container = this.slotContainers[areaName];
    if (!container) return;

    if (areaName === 'recipeTemplate') {
      const recipeDiv = document.createElement('div');
      recipeDiv.id = 'recipe-template';
      recipeDiv.classList.add('dropzone');
      recipeDiv.dataset.type = 'accepts';
    } else {
      slots.forEach((slot, index) => {
        const slotDiv = document.createElement('div');
        slotDiv.classList.add('ore');
        slotDiv.dataset.index = index;
        if (slot.isFilled) slotDiv.classList.add('filled');
        container.appendChild(slotDiv);
      });
    }
  };

  displayOre = (ore, index) => {
    const oreButton = document.createElement('button');
    const oreDiv = this.inventoryContainer.querySelector(`[data-index="${index}"]`);

    oreButton.innerText = ore.name;
    oreButton.classList.add('ore', ore.name);
    oreButton.setAttribute('draggable', 'true');

    const type = 'ore';
    const idx = index;

    const dataID = `${type}-${idx}`;

    oreButton.dataset.type = type;
    oreButton.dataset.uid = dataID;

    oreDiv.appendChild(oreButton);

    oreButton.addEventListener('dragstart', event => {
      event.target.classList.add('dragging');
      event.dataTransfer.setData('text/plain', dataID);
    });
    oreButton.addEventListener('dragend', event => {
      event.target.classList.remove('dragging');
    });
  };

  showInventoryFullMessage = () => {
    alert('Your inventory is full!');
  };

  noRecipeNameError = () => {
    alert('Your recipe has to have a name');
  };

  showWrongIngredientsMessage = () => {
    alert("Oops.. It seems you're using wrong ingredients");
  };

  // DRAG AND DROP BEGINS //

  addEventListenerOnDrop = () => {
    const dropZone = Array.from(document.getElementsByClassName('dropzone'));

    dropZone.forEach(zone => {
      const dropZoneID = zone.getAttribute('id');
      zone.addEventListener('dragover', event => event.preventDefault());
      zone.addEventListener('drop', event => {
        event.preventDefault();
        this.handleDrop(event, dropZoneID);
      });
    });
  };

  getDragData = event => {
    const dataID = event.dataTransfer.getData('text/plain');
    const [type, id] = dataID.split('-');
    const dragged = document.querySelector(`[data-uid="${dataID}"]`);

    return {
      type,
      id,
      dragged,
    };
  };

  handleDrop = (event, dropZoneID) => {
    const { type, id, dragged } = this.getDragData(event);
    const allowedZones = dropPermissionMap[type];

    switch (dropZoneID) {
      case 'trash':
        this.handleTrashDrop(dragged, type, id);
        break;
      case 'create-new-recipe':
        if (allowedZones.includes(dropZoneID) && event.target.className === 'ore')
          this.handleNewRecipeDrop(event, dragged, id);
        break;
      case 'craft-slots':
        if (allowedZones.includes(dropZoneID) && event.target.className === 'ore')
          this.handleCraftingSlotsDrop(event, dragged, id);
        break;
      case 'recipe-template':
        if (allowedZones.includes(dropZoneID) && event.target.id === 'recipe-template')
          this.handleRecipeTemplateDrop(event, dragged, id);
        break;
      default:
    }
  };

  handleTrashDrop = (dragged, type, id) => {
    dragged.remove();
    if (type === 'ore' || type === 'item') {
      this.emitter.emit(EVENT_TYPES.DROP_TO_TRASH, 'inventory', id);
    } else if (type === 'recipe') {
      this.emitter.emit(EVENT_TYPES.DROP_TO_TRASH, 'recipe', id);
    }
  };

  handleNewRecipeDrop = (event, dragged, id) => {
    event.target.appendChild(dragged);
    this.emitter.emit(EVENT_TYPES.DROP_TO_NEW_RECIPE, id);
  };

  handleCraftingSlotsDrop = (event, dragged, id) => {
    event.target.appendChild(dragged);
    this.emitter.emit(EVENT_TYPES.DROP_TO_CRAFTING_SLOTS, id);
  };

  handleRecipeTemplateDrop = (event, dragged, id) => {
    const recipeClone = dragged.cloneNode(true);
    recipeClone.classList.remove('dragging');
    recipeClone.style.height = '150px';
    recipeClone.style.width = '150px';
    event.target.appendChild(recipeClone);
    this.emitter.emit(EVENT_TYPES.DROP_TO_CRAFTING_TEMPLATE, id);
  };

  // DRAG AND DROP ENDS //

  saveNewRecipeInfo = () => {
    const nameInput = this.recipeNameElement.value;
    if (nameInput === '') {
      this.noRecipeNameError();
      return;
    }
    this.emitter.emit(EVENT_TYPES.CLICK_CREATE, nameInput);
    this.clearNewRecipeSlots();
  };

  displayRecipe = (recipe, index) => {
    const recipeButton = document.createElement('button');
    const recipeDiv = this.recipeSlots.querySelector(`[data-index="${index}"]`);

    recipeButton.innerText = recipe.name;
    recipeButton.classList.add('ore', 'user-recipe');
    recipeButton.setAttribute('draggable', 'true');

    const type = 'recipe';
    const idx = index;

    const dataID = `${type}-${idx}`;

    recipeButton.dataset.type = type;
    recipeButton.dataset.uid = dataID;

    recipeDiv.appendChild(recipeButton);

    this.recipeContainer.style.display = 'block';
    this.newRecipeContainer.replaceWith(this.recipeContainer);

    recipeButton.addEventListener('dragstart', event => {
      event.target.classList.add('dragging');
      event.dataTransfer.setData('text/plain', dataID);
    });
    recipeButton.addEventListener('dragend', event => {
      event.target.classList.remove('dragging');
    });
  };

  clearNewRecipeSlots = () => {
    this.recipeNameElement.value = '';
    const newRecipeSlots = this.slotContainers.newRecipe.querySelectorAll('.ore');

    newRecipeSlots.forEach(slot => {
      slot.innerHTML = '';
    });
  };

  displayItem = (newItem, index) => {
    this.recipeTemplate.innerHTML = '';

    const itemButton = document.createElement('button');
    const itemDiv = this.inventoryContainer.querySelector(`[data-index="${index}"]`);

    itemButton.innerText = newItem.name;
    itemButton.classList.add('ore', 'item');
    itemButton.setAttribute('draggable', 'true');
    itemButton.dataset.type = 'item';
    itemButton.dataset.uid = index;
    const uniqueID = itemButton.dataset.uid;

    itemDiv.appendChild(itemButton);

    itemButton.addEventListener('dragstart', event => {
      event.target.classList.add('dragging');
      event.dataTransfer.setData('text/plain', uniqueID);
    });
    itemButton.addEventListener('dragend', event => {
      event.target.classList.remove('dragging');
    });
    this.clearCraftingContainer();
  };

  clearCraftingContainer = () => {
    const newItemSlots = this.slotContainers.forge.querySelectorAll('.ore');

    newItemSlots.forEach(slot => {
      slot.innerHTML = '';
    });
  };
}
