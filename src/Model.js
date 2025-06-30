import Slot from './Slot';
import Recipe from './Recipe';
import Ore from './Ore';
import Item from './Item';
import { EVENT_TYPES } from './EventEmitter';

export default class Model {
  constructor(emitter) {
    this.emitter = emitter;
    this.slotAreas = {};

    this.emitter.on(EVENT_TYPES.CLICK_ADD, this.clearAllSlotsInContainer);
  }

  init = () => {
    this.initSlots('forge', 8);
    this.initSlots('newRecipe', 8);
    this.initSlots('recipeTemplate', 1);
  };

  saveInventoryData = () => {
    localStorage.setItem('inventory', JSON.stringify(this.slotAreas.inventory));
  };

  saveRecipeData = () => {
    localStorage.setItem('recipe', JSON.stringify(this.slotAreas.recipe));
  };

  loadInventoryData = () => {
    const savedArray = localStorage.getItem('inventory');
    if (!savedArray) {
      this.initSlots('inventory', 20);
      return [];
    }

    const parsedArray = JSON.parse(savedArray);
    const unpackedArray = parsedArray.map(slot => {
      const newSlot = new Slot(slot.isFilled);
      if (slot.content) {
        const { type } = slot.content;
        if (type === 'ore') newSlot.content = new Ore(slot.content.name);
        if (type === 'item') newSlot.content = new Item(slot.content.name, slot.content.itemInfo);
      }
      return newSlot;
    });
    this.slotAreas.inventory = unpackedArray;
    return unpackedArray;
  };

  loadRecipeData = () => {
    const savedArray = localStorage.getItem('recipe');
    if (!savedArray) {
      this.initSlots('recipe', 23);
      return [];
    }

    const parsedArray = JSON.parse(savedArray);
    const unpackedArray = parsedArray.map(slot => {
      const newSlot = new Slot(slot.isFilled);
      if (slot.content) {
        newSlot.content = new Recipe(slot.content.name, slot.content.oreInfo);
      }
      return newSlot;
    });
    this.slotAreas.recipe = unpackedArray;
    return unpackedArray;
  };

  createSlots = count => {
    const slots = [];
    for (let i = 0; i < count; i++) {
      slots.push(new Slot(false));
    }
    return slots;
  };

  initSlots = (areaName, count) => {
    const slots = this.createSlots(count);
    this.slotAreas[areaName] = slots;
    this.emitter.emit(EVENT_TYPES.SLOTS_CREATED, { areaName, slots });
  };

  findFirstEmptySlotIndex = areaName => {
    const area = this.getSlots(areaName);
    return area.findIndex(slot => !slot.isFilled);
  };

  getSlots = container => {
    return this.slotAreas[container] || [];
  };

  getElementFromContainer = (areaName, index) => {
    const area = this.getSlots(areaName);
    return area[index].content;
  };

  clearSlot(areaName, index) {
    const targetArea = this.getSlots(areaName);
    targetArea[index].content = null;
    targetArea[index].isFilled = false;
  }

  clearAllSlotsInContainer = container => {
    const targetArea = this.getSlots(container);
    for (let i = 0; i < targetArea.length; i++) {
      targetArea[i].content = null;
      targetArea[i].isFilled = false;
    }
  };

  updateSlotInfo = (areaName, data, index) => {
    const targetArea = this.getSlots(areaName);
    if (data === undefined) targetArea[index].content = null;
    targetArea[index].content = data;
    targetArea[index].isFilled = true;
  };

  createRecipe(nameInput) {
    const targetArray = this.slotAreas.newRecipe;
    const oreInfo = targetArray.filter(obj => obj.content !== null);
    const newRecipe = new Recipe(nameInput, oreInfo);
    return newRecipe;
  }

  getInfoForItem = () => {
    const recipe = this.slotAreas.recipeTemplate[0];
    const recipeName = recipe.content.name;
    const recipeIngredients = recipe.content.oreInfo;
    const arrayWithOresFromRecipe = [];
    recipe.content.oreInfo.forEach(e => {
      if (e.isFilled === true) arrayWithOresFromRecipe.push(e.content.name);
    });

    const arrayWithOresFromForgeSlots = [];
    const arrayFromForge = this.getSlots('forge');

    arrayFromForge.forEach(e => {
      if (e.isFilled === true) arrayWithOresFromForgeSlots.push(e.content.name);
    });

    return [recipeName, recipeIngredients, arrayWithOresFromRecipe, arrayWithOresFromForgeSlots];
  };
}
