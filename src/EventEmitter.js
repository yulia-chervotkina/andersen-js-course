export const EVENT_TYPES = {
  CLICK_ADD: 'click-add',
  CLICK_MINE: 'click-mine',
  CLICK_CREATE: 'click-create-new-recipe',
  CLICK_CANCEL: 'click-cancel',
  CLICK_FORGE: 'click-forge',
  DROP_TO_TRASH: 'drop-to-trash',
  DROP_TO_NEW_RECIPE: 'drop-to-new-recipe',
  DROP_TO_CRAFTING_SLOTS: 'drop-to-crafting-slots',
  DROP_TO_CRAFTING_TEMPLATE: 'drop-to-crafting-template',
  SLOTS_CREATED: 'slots-created',
  WRONG_INGREDIENTS: 'wrong-ingredients',
  INVENTORY_LOADED: 'inventory-loaded',
};

export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventID, cb) {
    if (!Array.isArray(this.events[eventID])) this.events[eventID] = [];
    this.events[eventID].push(cb);
  }

  off(eventID, cb) {
    const index = this.events[eventID].indexOf(cb);
    if (index === -1) return;
    this.events[eventID].splice(index, 1);
  }

  emit(eventID, ...args) {
    if (!this.events[eventID]) return;
    this.events[eventID].forEach(cb => cb(...args));
  }
}
