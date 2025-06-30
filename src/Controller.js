import Ore from './Ore';
import Item from './Item';
import { EVENT_TYPES } from './EventEmitter';

const ORE_TYPES = {
  gold: 'gold',
  silver: 'silver',
  copper: 'copper',
  brass: 'brass',
  nickel: 'nickel',
  iron: 'iron',
};

const ORE_TO_WEIGHT_MAP = {
  [ORE_TYPES.gold]: 1,
  [ORE_TYPES.silver]: 2,
  [ORE_TYPES.copper]: 3,
  [ORE_TYPES.brass]: 4,
  [ORE_TYPES.nickel]: 5,
  [ORE_TYPES.iron]: 6,
};

export default class Controller {
  constructor(model, view, emitter) {
    this.model = model;
    this.view = view;
    this.emitter = emitter;

    this.emitter.on(EVENT_TYPES.CLICK_MINE, this.mine);
    this.emitter.on(EVENT_TYPES.CLICK_CREATE, this.create);
    this.emitter.on(EVENT_TYPES.CLICK_CANCEL, this.cancel);
    this.emitter.on(EVENT_TYPES.CLICK_FORGE, this.forge);
    this.emitter.on(EVENT_TYPES.DROP_TO_TRASH, this.onDropToTrashZone);
    this.emitter.on(EVENT_TYPES.DROP_TO_NEW_RECIPE, this.onDropToNewRecipe);
    this.emitter.on(EVENT_TYPES.DROP_TO_CRAFTING_SLOTS, this.onDropToCraftingSlots);
    this.emitter.on(EVENT_TYPES.DROP_TO_CRAFTING_TEMPLATE, this.onDropToCraftingTemplate);
  }

  init = () => {
    this.initInventrory();
    this.initRecipe();
    this.model.init();
  };

  initInventrory = () => {
    const loadedSlots = this.model.loadInventoryData();
    this.view.displaySlots({ areaName: 'inventory', slots: loadedSlots });
    loadedSlots.forEach((slot, index) => {
      if (slot.isFilled && slot.content) {
        if (slot.content.type === 'ore') this.view.displayOre(slot.content, index);
        if (slot.content.type === 'item') this.view.displayItem(slot.content, index);
      }
    });
  };

  initRecipe = () => {
    const loadedSlots = this.model.loadRecipeData();
    this.view.displaySlots({ areaName: 'recipe', slots: loadedSlots });
    loadedSlots.forEach((slot, index) => {
      if (slot.isFilled && slot.content) this.view.displayRecipe(slot.content, index);
    });
  };

  getRandomOre = () => {
    const totalWeight = Object.values(ORE_TYPES).reduce(
      (sum, ore) => sum + ORE_TO_WEIGHT_MAP[ore],
      0
    );
    let randomNum = Math.random() * totalWeight;

    const oreType = Object.values(ORE_TYPES).find(ore => {
      randomNum -= ORE_TO_WEIGHT_MAP[ore];
      return randomNum <= 0;
    });

    return new Ore(oreType);
  };

  mine = () => {
    const index = this.model.findFirstEmptySlotIndex('inventory');

    if (index === -1) {
      this.view.showInventoryFullMessage();
      return;
    }

    const newOre = this.getRandomOre();
    this.model.updateSlotInfo('inventory', newOre, index);
    this.view.displayOre(newOre, index);
    this.model.saveInventoryData();
  };

  onDropToTrashZone = (areaName, index) => {
    this.model.clearSlot(areaName, index);
    this.model.saveInventoryData();
    this.model.saveRecipeData();
  };

  onDropToNewRecipe = inventoryIndex => {
    const ore = this.model.getElementFromContainer('inventory', inventoryIndex);
    const index = this.model.findFirstEmptySlotIndex('newRecipe');
    if (index !== -1) {
      this.model.updateSlotInfo('newRecipe', ore, index);
      this.model.clearSlot('inventory', inventoryIndex);
      this.model.saveInventoryData();
    }
  };

  create = nameInput => {
    const newRecipe = this.model.createRecipe(nameInput);
    const index = this.model.findFirstEmptySlotIndex('recipe');

    if (index === -1) {
      this.view.showInventoryFullMessage();
      return;
    }

    this.model.updateSlotInfo('recipe', newRecipe, index);
    this.view.displayRecipe(newRecipe, index);
    this.model.saveRecipeData();
  };

  cancel = () => {
    this.view.clearNewRecipeSlots();
  };

  onDropToCraftingSlots = inventoryIndex => {
    const ore = this.model.getElementFromContainer('inventory', inventoryIndex);
    const index = this.model.findFirstEmptySlotIndex('forge');
    if (index !== -1) {
      this.model.updateSlotInfo('forge', ore, index);
      this.model.clearSlot('inventory', inventoryIndex);
    }
  };

  onDropToCraftingTemplate = index => {
    const recipe = this.model.getElementFromContainer('recipe', index);
    this.model.updateSlotInfo('recipeTemplate', recipe, 0);
  };

  forge = () => {
    const targetArray = this.model.getInfoForItem();
    const [
      recipeName,
      recipeIngredients,
      arrayWithOresFromRecipe,
      arrayWithOresFromForgeSlots,
    ] = targetArray;

    if (
      arrayWithOresFromRecipe.length !== arrayWithOresFromForgeSlots.length ||
      JSON.stringify(arrayWithOresFromRecipe.sort()) !==
        JSON.stringify(arrayWithOresFromForgeSlots.sort())
    ) {
      this.view.showWrongIngredientsMessage();
      return;
    }

    const newItem = new Item(recipeName, recipeIngredients);
    this.displayCreatedItem(newItem);
  };

  displayCreatedItem = newItem => {
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
  };
}
