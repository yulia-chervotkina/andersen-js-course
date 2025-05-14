import Slot from './Slot';

export default class Model {
  constructor(emitter) {
    this.EventEmitter = emitter;
    this.inventorySlots = [];

    this.EventEmitter.on('onDOMLoaded', this.createSlots.bind(this));
  }

  createSlots() {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 20; i++) {
      const newSlot = new Slot(false);
      this.inventorySlots.push(newSlot);
    }
    this.EventEmitter.emit('slotsCreated', this.inventorySlots);
  }

  findFirstEmptySlotIndex() {
    return this.inventorySlots.findIndex(slot => !slot.isFilled);
  }

  clearSlot(index) {
    this.inventorySlots[index].content = null;
    this.inventorySlots[index].isFilled = false;
  }
}
