/* eslint-disable no-plusplus */
import Ore from './Ore';

// const ORE_TO_WEIGHT_MAP = {
//   gold: 6,
// };

// const EVENT_TYPES = {
//   ON_CLICK_MINE: 'click:mine',
// };

export default class Controller {
  constructor(model, view, emitter) {
    this.model = model;
    this.view = view;
    this.emitter = emitter;
    this.oresCollection = [
      new Ore('gold', 1),
      new Ore('silver', 2),
      new Ore('copper', 3),
      new Ore('brass', 4),
      new Ore('nickel', 5),
      new Ore('iron', 6),
    ];
    // ///////////// EVENT EMITTER ///////////////
    this.emitter.on('click:mine', this.mine.bind(this));
    this.emitter.on('click:create', this.create.bind(this));
    this.emitter.on('click:cancel', this.cancel.bind(this));
    this.emitter.on('click:forge', this.forge.bind(this));
    this.emitter.on('drop:trash', this.onDropToTrashZone.bind(this));
    this.emitter.on('drop:newRecipe', this.onDropToNewRecipe.bind(this));
    this.emitter.on('drop:craftingSlots', this.onDropToCraftingSlots.bind(this));
    this.emitter.on('drop:craftingTemplate', this.onDropToCraftingTemplate.bind(this));
  }

  init() {
    this.initInventrory();
    this.initRecipe();
    this.model.initSlots('forge', 8);
    this.model.initSlots('newRecipe', 8);
    this.model.initSlots('recipeTemplate', 1);
  }

  initInventrory() {
    const loadedSlots = this.model.loadInventoryData();
    const isFilledWithOre = loadedSlots.some(slot => slot.content !== null);
    if (isFilledWithOre) {
      this.emitter.emit('slotsCreated', { areaName: 'inventory', slots: loadedSlots });

      loadedSlots.forEach((slot, index) => {
        if (slot.isFilled && slot.content) {
          this.view.displayOre(slot.content, index);
        }
      });
    } else {
      this.model.initSlots('inventory', 20);
    }
  }

  initRecipe() {
    const loadedSlots = this.model.loadRecipeData();
    const isFilledWithRecipe = loadedSlots.some(slot => slot.content !== null);
    if (isFilledWithRecipe) {
      this.emitter.emit('slotsCreated', { areaName: 'recipe', slots: loadedSlots });

      loadedSlots.forEach((slot, index) => {
        if (slot.isFilled && slot.content) {
          this.view.displayRecipe(slot.content, index);
        }
      });
    } else {
      this.model.initSlots('recipe', 23);
    }
  }

  getRandomOre() {
    const totalWeight = this.oresCollection.reduce((sum, ore) => sum + ore.weight, 0);
    let randomNum = Math.random() * totalWeight;
    return this.oresCollection.find(ore => {
      randomNum -= ore.weight;
      return randomNum <= 0;
    });
  }

  mine() {
    const index = this.model.findFirstEmptySlotIndex('inventory');

    if (index === -1) {
      this.view.showInventoryFullMessage();
      return;
    }

    const newOre = this.getRandomOre();
    this.model.updateSlotInfo('inventory', newOre, index);
    this.view.displayOre(newOre, index);
    this.model.saveInventoryData();
  }

  onDropToTrashZone(areaName, index) {
    this.model.clearSlot(areaName, index);
    this.model.saveInventoryData();
  }

  onDropToNewRecipe(inventoryIndex) {
    const ore = this.model.getElementFromContainer('inventory', inventoryIndex);
    const index = this.model.findFirstEmptySlotIndex('newRecipe');
    if (index !== -1) {
      this.model.updateSlotInfo('newRecipe', ore, index);
      this.model.clearSlot('inventory', inventoryIndex);
      this.model.saveInventoryData();
    }
  }

  create(nameInput) {
    const newRecipe = this.model.createRecipe(nameInput);
    const index = this.model.findFirstEmptySlotIndex('recipe');

    if (index === -1) {
      this.view.showInventoryFullMessage(); // change this to the correct error
      return;
    }

    this.model.updateSlotInfo('recipe', newRecipe, index);
    this.view.displayRecipe(newRecipe, index);
    this.model.saveRecipeData();
    this.model.clearAllSlotsInContainer('newRecipe');
  }

  cancel() {
    this.view.clearNewRecipeSlots();
  }

  onDropToCraftingSlots(inventoryIndex) {
    const ore = this.model.getElementFromContainer('inventory', inventoryIndex);
    const index = this.model.findFirstEmptySlotIndex('forge');
    if (index !== -1) {
      this.model.updateSlotInfo('forge', ore, index);
      this.model.clearSlot('inventory', inventoryIndex);
    }
  }

  onDropToCraftingTemplate(index) {
    const recipe = this.model.getElementFromContainer('recipe', index);
    this.model.updateSlotInfo('recipeTemplate', recipe, 0);
  }

  forge() {
    const newItem = this.model.forgeItem();
    const index = this.model.findFirstEmptySlotIndex('inventory');

    if (!newItem) return;
    if (index === -1) {
      this.view.showInventoryFullMessage();
      return;
    }

    this.view.displayItem(newItem, index);
    this.model.updateSlotInfo('inventory', newItem, index);
    this.model.clearAllSlotsInContainer('forge');
    this.model.saveInventoryData();
  }
}
