import Ore from './Ore';
import { EVENT_TYPES } from './EventEmitter';

const ORE_TO_WEIGHT_MAP = {
  gold: 1,
  silver: 2,
  copper: 3,
  brass: 4,
  nickel: 5,
  iron: 6,
};

export default class Controller {
  constructor(model, view, emitter) {
    this.model = model;
    this.view = view;
    this.emitter = emitter;
    this.oresCollection = [
      new Ore('gold'),
      new Ore('silver'),
      new Ore('copper'),
      new Ore('brass'),
      new Ore('nickel'),
      new Ore('iron'),
    ];

    this.emitter.on(EVENT_TYPES.CLICK_MINE, () => this.mine());
    this.emitter.on(EVENT_TYPES.CLICK_CREATE, nameInput => this.create(nameInput));
    this.emitter.on(EVENT_TYPES.CLICK_CANCEL, () => this.cancel());
    this.emitter.on(EVENT_TYPES.CLICK_FORGE, () => this.forgeNewItem());
    this.emitter.on(EVENT_TYPES.DROP_TO_TRASH, (areaName, id) =>
      this.onDropToTrashZone(areaName, id)
    );
    this.emitter.on(EVENT_TYPES.DROP_TO_NEW_RECIPE, id => this.onDropToNewRecipe(id));
    this.emitter.on(EVENT_TYPES.DROP_TO_CRAFTING_SLOTS, id => this.onDropToCraftingSlots(id));
    this.emitter.on(EVENT_TYPES.DROP_TO_CRAFTING_TEMPLATE, id => this.onDropToCraftingTemplate(id));
  }

  init() {
    this.initInventrory();
    this.initRecipe();
    this.model.init();
  }

  initInventrory() {
    const loadedSlots = this.model.loadInventoryData();
    this.view.displaySlots({ areaName: 'inventory', slots: loadedSlots });
    loadedSlots.forEach((slot, index) => {
      if (slot.isFilled && slot.content) {
        if (slot.content.type === 'ore') this.view.displayOre(slot.content, index);
        if (slot.content.type === 'item') this.view.displayItem(slot.content, index);
      }
    });
  }

  initRecipe() {
    const loadedSlots = this.model.loadRecipeData();
    this.view.displaySlots({ areaName: 'recipe', slots: loadedSlots });
    loadedSlots.forEach((slot, index) => {
      if (slot.isFilled && slot.content) this.view.displayRecipe(slot.content, index);
    });
  }

  getRandomOre() {
    const totalWeight = this.oresCollection.reduce(
      (sum, ore) => sum + ORE_TO_WEIGHT_MAP[ore.name],
      0
    );
    let randomNum = Math.random() * totalWeight;

    return this.oresCollection.find(ore => {
      randomNum -= ORE_TO_WEIGHT_MAP[ore.name];
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
    this.model.saveRecipeData();
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
      this.view.showInventoryFullMessage();
      return;
    }

    this.model.updateSlotInfo('recipe', newRecipe, index);
    this.view.displayRecipe(newRecipe, index);
    this.model.saveRecipeData();
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

  forgeNewItem() {
    const recipe = this.model.slotAreas.recipeTemplate[0];
    const recipeName = recipe.content.name;

    const arrayWithOresFromRecipe = [];

    for (let i = 0; i < recipe.content.oreInfo.length; i++) {
      if (recipe.content.oreInfo[i].isFilled === true) {
        arrayWithOresFromRecipe.push(recipe.content.oreInfo[i].content.name);
      }
    }

    const arrayWithOresFromForgeSlots = [];

    const arrayFromForge = this.model.getSlots('forge');
    for (let i = 0; i < arrayFromForge.length; i++) {
      if (arrayFromForge[i].isFilled === true) {
        arrayWithOresFromForgeSlots.push(arrayFromForge[i].content.name);
      }
    }

    if (
      arrayWithOresFromRecipe.length !== arrayWithOresFromForgeSlots.length ||
      JSON.stringify(arrayWithOresFromRecipe.sort()) !==
        JSON.stringify(arrayWithOresFromForgeSlots.sort())
    ) {
      this.view.showWrongIngredientsMessage();
      return;
    }

    const newItem = this.model.forgeItem(recipeName, recipe.content.oreInfo);
    this.forge(newItem);
  }

  forge(newItem) {
    const index = this.model.findFirstEmptySlotIndex('inventory');

    if (!newItem) return;
    if (index === -1) {
      this.view.showInventoryFullMessage();
      return;
    }

    this.model.updateSlotInfo('inventory', newItem, index);
    this.view.displayItem(newItem, index);
    this.model.saveInventoryData();
    this.model.clearAllSlotsInContainer('forge');
  }
}
