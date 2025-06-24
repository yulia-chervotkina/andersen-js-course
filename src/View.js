/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-alert */
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

    this.emitter.on('slotsCreated', this.displaySlots.bind(this));
    this.emitter.on('onWrongIngredients', this.showWrongIngredientsMessage.bind(this));

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

    this.infoButton.addEventListener('click', () => {
      this.modal.style.display = 'block';
    });
    this.closeButton.addEventListener('click', () => {
      this.modal.style.display = 'none';
    });
    this.addNewRecipeButton.addEventListener('click', () => {
      this.newRecipeContainer.style.display = 'block';
      this.recipeContainer.replaceWith(this.newRecipeContainer);
    });
    this.cancelButton.addEventListener('click', () => {
      this.emitter.emit('click:cancel');
      this.newRecipeContainer.replaceWith(this.recipeContainer);
    });
    this.createNewRecipeButton.addEventListener('click', () => this.saveNewRecipeInfo());
    this.mineButton.addEventListener('click', () => {
      this.emitter.emit('click:mine');
    });
    this.forgeButton.addEventListener('click', () => {
      this.emitter.emit('click:forge');
    });

    this.manageDrop();
  }

  displaySlots({ areaName, slots }) {
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
  }

  displayOre(ore, index) {
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
  }

  showInventoryFullMessage() {
    alert('Your inventory is full!');
  }

  noRecipeNameError() {
    alert('Your recipe has to have a name');
  }

  showWrongIngredientsMessage() {
    alert("Oops.. It seems you're using wrong ingredients");
  }

  manageDrop() {
    const dropZone = document.getElementsByClassName('dropzone');

    for (let i = 0; i < dropZone.length; i++) {
      const dropZoneID = dropZone[i].getAttribute('id');
      dropZone[i].addEventListener('dragover', event => {
        event.preventDefault();
      });

      dropZone[i].addEventListener('drop', event => {
        event.preventDefault();

        const dataID = event.dataTransfer.getData('text/plain');
        const [type, id] = dataID.split('-');
        const dragged = document.querySelector(`[data-uid="${dataID}"]`);

        const draggedType = type;
        event.dataTransfer.getData('type');
        const allowedZones = dropPermissionMap[draggedType];
        switch (dropZoneID) {
          case 'trash':
            dragged.remove();
            if (draggedType === 'ore') {
              this.emitter.emit('drop:trash', 'inventory', id);
            } else if (draggedType === 'recipe') {
              this.emitter.emit('drop:trash', 'recipe', id);
            }
            break;
          case 'create-new-recipe':
            if (allowedZones.includes(dropZoneID) && event.target.className === 'ore')
              event.target.appendChild(dragged);
            this.emitter.emit('drop:newRecipe', id);
            break;
          case 'craft-slots':
            if (allowedZones.includes(dropZoneID) && event.target.className === 'ore')
              event.target.appendChild(dragged);
            this.emitter.emit('drop:craftingSlots', id);
            break;
          case 'recipe-template':
            if (allowedZones.includes(dropZoneID) && event.target.id === 'recipe-template') {
              const recipeClone = dragged.cloneNode(true);
              recipeClone.classList.remove('dragging');
              // recipeClone.classList.add('craft-zone-recipe');
              event.target.appendChild(recipeClone);
              this.emitter.emit('drop:craftingTemplate', id);
            }
            break;
          default: // do nothing
        }
      });
    }
  }

  saveNewRecipeInfo() {
    const nameInput = this.recipeNameElement.value;
    if (nameInput === '') {
      this.noRecipeNameError();
      return;
    }
    this.emitter.emit('click:create', nameInput);
    this.clearNewRecipeSlots();
  }

  displayRecipe(recipe, index) {
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
  }

  clearNewRecipeSlots() {
    this.recipeNameElement.value = '';
    const newRecipeSlots = this.slotContainers.newRecipe.querySelectorAll('.ore');

    newRecipeSlots.forEach(slot => {
      slot.innerHTML = '';
    });
  }

  displayItem(newItem, index) {
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
  }

  clearCraftingContainer() {
    const newItemSlots = this.slotContainers.forge.querySelectorAll('.ore');

    newItemSlots.forEach(slot => {
      slot.innerHTML = '';
    });
  }
}
