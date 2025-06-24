/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
import Slot from './Slot';
import Recipe from './Recipe';
import Ore from './Ore';
import Item from './Item';

export default class Model {
  constructor(emitter) {
    this.emitter = emitter;
    this.slotAreas = {};
  }

  saveInventoryData() {
    localStorage.setItem('inventory', JSON.stringify(this.slotAreas.inventory));
  }

  saveRecipeData() {
    localStorage.setItem('recipe', JSON.stringify(this.slotAreas.recipe));
  }

  loadInventoryData() {
    const savedArray = localStorage.getItem('inventory');
    if (!savedArray) return [];
    const parsedArray = JSON.parse(savedArray);
    const unpackedArray = parsedArray.map(slot => {
      const newSlot = new Slot(slot.isFilled);
      if (slot.content) {
        newSlot.content = new Ore(slot.content.name, slot.content.weight);
      }
      return newSlot;
    });
    this.slotAreas.inventory = unpackedArray;
    return unpackedArray;
  }

  loadRecipeData() {
    const savedArray = localStorage.getItem('recipe');
    if (!savedArray) return [];
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
  }

  createSlots(count) {
    const slots = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < count; i++) {
      slots.push(new Slot(false));
    }
    return slots;
  }

  initSlots(areaName, count) {
    const slots = this.createSlots(count);
    this.slotAreas[areaName] = slots;
    this.emitter.emit('slotsCreated', { areaName, slots });
  }

  findFirstEmptySlotIndex(areaName) {
    const area = this.getSlots(areaName);
    return area.findIndex(slot => !slot.isFilled);
  }

  getSlots(container) {
    return this.slotAreas[container] || [];
  }

  getElementFromContainer(areaName, index) {
    const area = this.getSlots(areaName);
    return area[index].content;
  }

  clearSlot(areaName, index) {
    const targetArea = this.getSlots(areaName);
    targetArea[index].content = null;
    targetArea[index].isFilled = false;
  }

  clearAllSlotsInContainer(container) {
    const targetArea = this.getSlots(container);
    for (let i = 0; i < targetArea.length; i++) {
      targetArea[i].content = null;
      targetArea[i].isFilled = false;
    }
  }

  updateSlotInfo(areaName, data, index) {
    const targetArea = this.getSlots(areaName);
    if (data === undefined) targetArea[index].content = null;
    targetArea[index].content = data;
    targetArea[index].isFilled = true;
  }

  createRecipe(name) {
    const targetArray = this.slotAreas.newRecipe;
    const oreInfo = targetArray.filter(obj => obj.content !== null);
    const newRecipe = new Recipe(name, oreInfo);
    return newRecipe;
  }

  forgeItem() {
    // taking recipe object from the craftingTemplate array
    const recipe = this.slotAreas.recipeTemplate[0];
    const recipeName = recipe.content.name;
    let newItem;

    // looping thru Recipe object to collect ore names into an array
    const arrayWithOresFromRecipe = [];

    for (let i = 0; i < recipe.content.oreInfo.length; i++) {
      if (recipe.content.oreInfo[i].isFilled === true) {
        arrayWithOresFromRecipe.push(recipe.content.oreInfo[i].content.name);
      }
    }

    // looping thru the ores in the forge zone to collect ore names into an array
    const arrayWithOresFromForgeSlots = [];
    const arrayFromForge = this.slotAreas.forge;
    for (let i = 0; i < arrayFromForge.length; i++) {
      if (arrayFromForge[i].isFilled === true) {
        arrayWithOresFromForgeSlots.push(arrayFromForge[i].content.name);
      }
    }

    // compare the two above arrays
    // if their length is different OR ores are different, print an error and leave the function
    if (arrayWithOresFromRecipe.length !== arrayWithOresFromForgeSlots.length) {
      this.emitter.emit('onWrongIngredients');
    } else if (
      JSON.stringify(arrayWithOresFromRecipe.sort()) !==
      JSON.stringify(arrayWithOresFromForgeSlots.sort())
    ) {
      this.emitter.emit('onWrongIngredients');
    } else {
      newItem = new Item(recipeName, recipe.content.oreInfo);
    }
    return newItem;
  }
}
